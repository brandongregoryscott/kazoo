import * as vscode from "vscode";
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
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationsFromJson = async (
    cultureFilePath?: string,
    jsonFilePath?: string
) => {
    const cultureFiles = await ProjectUtils.getCultureFiles();
    const cultureFilePaths = cultureFiles.map((file) => file.getFilePath());

    if (cultureFilePath == null) {
        cultureFilePath = await vscode.window.showQuickPick(cultureFilePaths, {
            ignoreFocusOut: true,
        });
    }

    const cultureFile = cultureFiles.find(
        (file) => file.getFilePath() === cultureFilePath
    );

    if (cultureFilePath == null || cultureFile == null) {
        return;
    }

    if (jsonFilePath == null) {
        jsonFilePath = await WindowUtils.prompt(
            `Enter a path/glob pattern to the JSON file to merge into ${cultureFilePath}`
        );
    }

    if (jsonFilePath == null) {
        return;
    }

    const translations = await _parseJsonFile(jsonFilePath);
    if (translations == null) {
        return;
    }

    await _replaceTranslations(translations, cultureFile);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _mapToPropertyAssignments = (
    translations: Record<string, string>,
    existingProperties: Property[]
): Array<OptionalKind<PropertyAssignmentStructure>> =>
    Object.entries(translations).map(([key, value]) => {
        return {
            name: StringUtils.quoteEscapeIfNeeded(key, existingProperties),
            initializer: StringUtils.quoteEscape(value),
        };
    });

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
        // BSCOTT: Throw error here, or handle this scenario differently?
        return;
    }

    const existingProperties = NodeUtils.getPropertyAssignments(resourceObject);

    const updatedProperties = _mapToPropertyAssignments(
        translations,
        existingProperties
    );

    NodeUtils.updateProperties(existingProperties, updatedProperties);

    return file.save();
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationsFromJson };

// #endregion Exports
