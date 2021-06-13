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
import { StringUtils } from "../utilities/string-utils";
import { log } from "../utilities/log";
import { UpdatePropertiesResult } from "../interfaces/update-properties-result";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const CULTURE_FILE_UPDATED = "Successfully updated culture file!";
const ERROR_FILETYPE_UNSUPPORTED =
    "The file path or pattern provided must end with a .json or .xlsx extension.";
const ERROR_UPDATING_CULTURE_FILE =
    "There was an error updating the culture file.";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationsFromFile = async (
    cultureFilePath?: string,
    inputFilePath?: string
) => {
    try {
        const cultureFile = await _getCultureFileToUpdate(cultureFilePath);
        if (cultureFile == null) {
            return;
        }

        const translations = await _getTranslationsFromJsonFile(
            cultureFile.getFilePath(),
            inputFilePath
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

        log.info(
            `Successfully updated ${cultureFile.getBaseName()}. ${_formatUpdateResult(
                updateResult
            )}`
        );

        const { notFound } = updateResult;
        if (notFound.length > 0) {
            return await WindowUtils.warning(_getExtraKeysWarning(notFound));
        }

        return await WindowUtils.info(CULTURE_FILE_UPDATED);
    } catch (error) {
        return await CoreUtils.catch(replaceTranslationsFromFile, error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _formatUpdateResult = (result: UpdatePropertiesResult): string =>
    `Updated: ${result.updated.length} Unmodified: ${result.unmodified.length} Not found: ${result.notFound.length}`;

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
    inputFilePath?: string
): Promise<Record<string, string> | undefined> => {
    if (inputFilePath == null) {
        inputFilePath = await WindowUtils.prompt(
            `Enter a path/glob pattern to the file to merge into ${cultureFilePath}`
        );
    }

    if (inputFilePath == null) {
        return;
    }

    if (
        !StringUtils.isExcelFile(inputFilePath) &&
        !StringUtils.isJsonFile(inputFilePath)
    ) {
        await WindowUtils.error(ERROR_FILETYPE_UNSUPPORTED);
        return;
    }

    return _parseFile(inputFilePath);
};

const _parseFile = async (
    pathOrPattern: string
): Promise<Record<string, string> | undefined> => {
    try {
        const path = await FileUtils.findFirst(pathOrPattern);
        if (path == null) {
            return;
        }
        const fileContents = fs.readFileSync(path);

        const parsedValues: Record<string, string> = StringUtils.isJsonFile(
            path
        )
            ? JSON.parse(fileContents.toString())
            : _.fromPairs(await readXlsxFile(fileContents));

        return _sanitizedParsedValues(parsedValues);
    } catch (error) {
        WindowUtils.error(error);
    }
};

const _replaceTranslations = async (
    translations: Record<string, string>,
    file: SourceFile
): Promise<UpdatePropertiesResult | undefined> => {
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

const _sanitizedParsedValues = (
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

export { replaceTranslationsFromFile };

// #endregion Exports
