import { ProjectUtils } from "../utilities/project-utils";
import { WindowUtils } from "../utilities/window-utils";
import * as fs from "fs";
import { FileUtils } from "../utilities/file-utils";
import {
    OptionalKind,
    PropertyAssignmentStructure,
    SourceFile,
} from "ts-morph";
import { StringUtils } from "../utilities/string-utils";
import { Property } from "../types/property";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { NodeUtils } from "../utilities/node-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const ERROR_FILE_MUST_BE_JSON =
    "The file path or pattern provided must end with a .json extension.";

const CULTURE_FILE_UPDATED = "Successfully updated culture file!";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationsFromJson = async (
    cultureFilePath?: string,
    jsonFilePath?: string
) => {
    const cultureFile = await _getCultureFileToUpdate(cultureFilePath);
    if (cultureFile == null) {
        return;
    }

    const translations = await _getTranslationsFromJsonFile(
        cultureFile.getFilePath(),
        jsonFilePath
    );
    if (translations == null) {
        return;
    }

    await _replaceTranslations(translations, cultureFile);

    await WindowUtils.info(CULTURE_FILE_UPDATED);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _getCultureFileToUpdate = async (
    cultureFilePath?: string
): Promise<SourceFile | undefined> => {
    const cultureFiles = await ProjectUtils.getCultureFiles();
    const cultureFilePaths = cultureFiles.map((file) => file.getFilePath());

    if (cultureFilePath == null) {
        cultureFilePath = await WindowUtils.selection(cultureFilePaths);
    }

    const cultureFile = cultureFiles.find(
        (file) => file.getFilePath() === cultureFilePath
    );

    if (cultureFilePath == null || cultureFile == null) {
        return;
    }

    return cultureFile;
};

const _getTranslationsFromJsonFile = async (
    cultureFilePath: string,
    jsonFilePath?: string
): Promise<Record<string, string> | undefined> => {
    if (jsonFilePath == null) {
        jsonFilePath = await WindowUtils.prompt(
            `Enter a path/glob pattern to the JSON file to merge into ${cultureFilePath}`
        );
    }

    if (jsonFilePath == null) {
        return;
    }

    if (!jsonFilePath.endsWith(".json")) {
        WindowUtils.error(ERROR_FILE_MUST_BE_JSON);
        return;
    }

    return _parseJsonFile(jsonFilePath);
};

const _parseJsonFile = async (
    pathOrPattern: string
): Promise<Record<string, string> | undefined> => {
    try {
        const path = await FileUtils.findFirst(pathOrPattern);
        const file = fs.readFileSync(path!);
        return JSON.parse(file.toString());
    } catch (error) {
        WindowUtils.error(error);
    }
};

const _replaceTranslations = async (
    translations: Record<string, string>,
    file: SourceFile
) => {
    const resourceObject = SourceFileUtils.getResourcesObject(file);
    if (resourceObject == null) {
        WindowUtils.errorResourcesNotFound(file);
        return;
    }

    const existingProperties = NodeUtils.getPropertyAssignments(resourceObject);
    const updatedProperties = NodeUtils.mapToPropertyAssignments(
        translations,
        existingProperties
    );

    const { extraProperties } = NodeUtils.updateProperties(
        existingProperties,
        updatedProperties
    );

    await file.save();

    if (extraProperties.length > 0) {
        await WindowUtils.warning(_getExtraKeysWarning(extraProperties));
    }
};

const _getExtraKeysWarning = (extraProperties: string[]): string => {
    const { length: count } = extraProperties;
    const keys = extraProperties.join(", ");

    const baseWarning = `Found ${count} keys in JSON file that are not in the source`;

    // Outputting over 5 keys could get messy with a toast.
    if (extraProperties.length > 5) {
        return baseWarning;
    }

    return `${baseWarning}:\n${keys}`;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationsFromJson };

// #endregion Exports
