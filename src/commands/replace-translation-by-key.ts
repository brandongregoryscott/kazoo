import { WindowUtils } from "../utilities/window-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { NodeUtils } from "../utilities/node-utils";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { Commands } from "../constants/commands";
import { PropertyUtils } from "../utilities/property-utils";
import { PropertyAssignment, SyntaxKind } from "ts-morph";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { StringUtils } from "../utilities/string-utils";
import { SharedConstants } from "../constants/shared-constants";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationByKey = async (
    key?: string,
    cultureFilePath?: string
) => {
    try {
        const cultureInterface = await ProjectUtils.getCultureInterface();
        const interfaceName = cultureInterface.getName();
        const interfaceProperties = cultureInterface.getProperties();
        const propertyNames = PropertyUtils.getNames(interfaceProperties);
        if (key == null) {
            key = await WindowUtils.selection(propertyNames);
        }

        if (key == null) {
            log.debug(
                `Key was not entered from prompt in ${Commands.replaceTranslationByKey}`
            );
            return;
        }

        const existingProperty = NodeUtils.findPropertyByName(
            key,
            interfaceProperties
        );
        if (existingProperty == null) {
            WindowUtils.info(
                `Key '${key}' does not exist in ${interfaceName}.`
            );
            return;
        }

        const cultureFiles = await ProjectUtils.getCultureFiles();
        const cultureFilePaths = cultureFiles.map((file) => file.getFilePath());

        if (cultureFilePath == null) {
            cultureFilePath = await WindowUtils.selection(cultureFilePaths);
        }

        if (cultureFilePath == null) {
            log.debug("No cultureFilePath entered - not continuing.");
            return;
        }

        const cultureFile = cultureFiles.find(
            (file) => file.getFilePath() === cultureFilePath
        );

        if (cultureFile == null) {
            log.warn(
                "cultureFile was unexpectedly null",
                cultureFilePath,
                cultureFile
            );
            return;
        }

        const resources = SourceFileUtils.getResourcesObject(cultureFile);
        if (resources == null) {
            WindowUtils.errorResourcesNotFound(cultureFile);
            return;
        }
        const objectLiteralWithProperty = NodeUtils.findObjectLiteralExpressionWithProperty(
            cultureFile.getDescendants(),
            key
        );

        const propertyAssignments = NodeUtils.getPropertyAssignments(
            objectLiteralWithProperty ?? resources
        );

        const property = NodeUtils.findPropertyByName<PropertyAssignment>(
            key,
            propertyAssignments
        );

        if (property == null) {
            log.warn(
                "Could not find translation for key",
                key,
                cultureFilePath
            );
            WindowUtils.warning(
                `Could not find translation for key '${key}' in ${cultureFile.getBaseName()}`
            );
            return;
        }

        const originalCopy = property.getInitializer()?.getText();
        if (originalCopy == null) {
            log.warn("Original copy was unexpectedly null", property);
            return;
        }

        const updatedCopy = await WindowUtils.prefilledPrompt(
            `Enter updated copy for '${key}'`,
            StringUtils.stripQuotes(originalCopy)
        );

        if (updatedCopy == null) {
            log.debug("Updated copy was not entered - not continuing.");
            return;
        }

        // const copyUpdatedOutsideOfResourcesObject =
        //     objectLiteralWithProperty != null &&
        //     objectLiteralWithProperty !== resources;
        // if (copyUpdatedOutsideOfResourcesObject) {
        //     await WindowUtils.prompt(
        //         `Would you like to move this copy to the inline '${SharedConstants.RESOURCES}' object?`
        //     );
        // }

        property.setInitializer(StringUtils.quoteEscape(updatedCopy));
        await cultureFile.save();

        WindowUtils.info(`Successfully updated '${key}' in ${interfaceName}!`);
    } catch (error) {
        CoreUtils.catch("replaceTranslationByKey", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationByKey };

// #endregion Exports
