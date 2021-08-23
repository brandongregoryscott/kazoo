import { WindowUtils } from "../utilities/window-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { NodeUtils } from "../utilities/node-utils";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { Commands } from "../constants/commands";
import { PropertyUtils } from "../utilities/property-utils";
import { PropertyAssignment } from "ts-morph";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { StringUtils } from "../utilities/string-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationByKey = async (
    key?: string,
    cultureFilePath?: string
) => {
    try {
        const cultureInterfaceFile = await ProjectUtils.getCultureInterfaceFile();
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
        const propertyAssignments = NodeUtils.getPropertyAssignments(
            resources!
        );
        const property = NodeUtils.findPropertyByName<PropertyAssignment>(
            key,
            propertyAssignments
        );
        if (property == null) {
            log.warn("Could not find translation for key", key, resources);
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
        await cultureFile.save();
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
