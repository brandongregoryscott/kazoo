import { ProjectUtils } from "../utilities/project-utils";
import { WindowUtils } from "../utilities/window-utils";
import * as fs from "fs";
import { FileUtils } from "../utilities/file-utils";
import { SourceFile } from "ts-morph";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { NodeUtils } from "../utilities/node-utils";
import _ from "lodash";
import { CoreUtils } from "../utilities/core-utils";
import readXlsxFile from "read-excel-file";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const CULTURE_FILE_UPDATED = "Successfully updated culture file!";
const ERROR_FILE_MUST_BE_JSON =
    "The file path or pattern provided must end with a .json extension.";
const ERROR_UPDATING_CULTURE_FILE =
    "There was an error updating the culture file.";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationsFromJson = async (
    cultureFilePath?: string,
    jsonFilePath?: string
) => {
    try {
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

        const updateResult = await _replaceTranslations(
            translations,
            cultureFile
        );
        if (updateResult == null) {
            return await WindowUtils.error(ERROR_UPDATING_CULTURE_FILE);
        }

        const { notFoundProperties } = updateResult;
        if (notFoundProperties.length > 0) {
            return await WindowUtils.warning(
                _getExtraKeysWarning(notFoundProperties)
            );
        }

        return await WindowUtils.info(CULTURE_FILE_UPDATED);
    } catch (error) {
        return await CoreUtils.catch(replaceTranslationsFromJson, error);
    }
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

const _getExtraKeysWarning = (notFoundProperties: string[]): string => {
    const { length: count } = notFoundProperties;
    const keys = notFoundProperties.join(", ");

    const warning = `Found ${count} keys in JSON file that are not in the source`;

    // Outputting over 5 keys could get messy with a toast.
    if (notFoundProperties.length > 5) {
        return warning;
    }

    return `${warning}:\n${keys}`;
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
        await WindowUtils.error(ERROR_FILE_MUST_BE_JSON);
        return;
    }

    return _parseJsonFile(jsonFilePath);
};

const _parseJsonFile = async (
    pathOrPattern: string
): Promise<Record<string, string> | undefined> => {
    try {
        const path = await FileUtils.findFirst(pathOrPattern);
        const fileContents = fs.readFileSync(path!);
        const parsedObject: Record<string, string> = JSON.parse(
            fileContents.toString()
        );

        return _sanitizeParsedJson(parsedObject);
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
        await WindowUtils.errorResourcesNotFound(file);
        return;
    }

    const existingProperties = NodeUtils.getPropertyAssignments(resourceObject);
    const updatedProperties = NodeUtils.mapToPropertyAssignments(
        translations,
        existingProperties
    );

    const updateResult = NodeUtils.updateProperties(
        existingProperties,
        updatedProperties
    );

    await file.save();

    return updateResult;
};

const _sanitizeParsedJson = (
    object: Record<string, string>
): Record<string, string> => {
    const clonedObject = Object.assign({}, object);
    Object.entries(clonedObject).map(([key, value]) => {
        if (!value.includes('"')) {
            return;
        }

        clonedObject[key] = value.replace(/"/gi, '\\"');
    });

    return clonedObject;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationsFromJson };

// #endregion Exports
