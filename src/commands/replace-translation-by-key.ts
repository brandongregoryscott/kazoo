import { WindowUtils } from "../utilities/window-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { NodeUtils } from "../utilities/node-utils";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { Commands } from "../constants/commands";
import { PropertyUtils } from "../utilities/property-utils";
import { ObjectLiteralExpression, PropertyAssignment } from "ts-morph";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { StringUtils } from "../utilities/string-utils";
import { SharedConstants } from "../constants/shared-constants";
import { ConfigUtils } from "../utilities/config-utils";

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
            key = await WindowUtils.selection(
                propertyNames,
                "Select a key to update copy for"
            );
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

        const cultureFile = SourceFileUtils.findByFilePath(
            cultureFiles,
            cultureFilePath
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

        property.setInitializer(StringUtils.quoteEscape(updatedCopy));

        await movePropertyIfRequested(
            objectLiteralWithProperty ?? resources,
            resources,
            property
        );

        await cultureFile.save();

        WindowUtils.info(
            `Successfully updated '${key}' in ${cultureFile.getBaseName()}!`
        );
    } catch (error) {
        CoreUtils.catch("replaceTranslationByKey", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const movePropertyIfRequested = async (
    objectLiteral: ObjectLiteralExpression,
    resources: ObjectLiteralExpression,
    property: PropertyAssignment
) => {
    const key = StringUtils.stripQuotes(property.getName());

    const copyUpdatedOutsideOfResourcesObject =
        objectLiteral != null && objectLiteral !== resources;

    if (!copyUpdatedOutsideOfResourcesObject) {
        return;
    }

    const answer = await WindowUtils.selection(
        [
            `Yes, move '${key}' to the '${SharedConstants.RESOURCES}' object`,
            `No, keep '${key}' where it is`,
        ],
        `Move this copy to the inline '${SharedConstants.RESOURCES}' object?`
    );

    if (answer == null || !answer.includes("Yes")) {
        return;
    }

    // Clone the property, remove it from the original object, and insert it into the 'resources' object
    const propertyStructure = property.getStructure();
    property.remove();

    const { insertionPosition } = ConfigUtils.get();

    const index = NodeUtils.findIndex(
        insertionPosition,
        key,
        resources.getProperties()
    );
    resources.insertPropertyAssignment(index, propertyStructure);
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationByKey };

// #endregion Exports
