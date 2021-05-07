import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SourceFile } from "ts-morph";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { WindowUtils } from "../utilities/window-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const RESOURCES = "resources";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationsFromJson = async (
    cultureFilePath?: string,
    jsonFilePath?: string
) => {
    const cultureInterface = await ProjectUtils.getCultureInterface();
    const cultureFiles = await ProjectUtils.getCultureFiles();

    const cultureFilePaths = cultureFiles.map((file) => file.getFilePath());

    if (cultureFilePath == null) {
        cultureFilePath = await vscode.window.showQuickPick(cultureFilePaths, {
            ignoreFocusOut: true,
        });
    }

    if (jsonFilePath == null) {
        jsonFilePath = await WindowUtils.prompt(
            `Enter a path/glob pattern to the file to merge into ${cultureFilePath}`
        );
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _formatCultureFileWithLanguage = (file: SourceFile) => {
    const baseLanguage = SourceFileUtils.getBaseLanguage(file)?.getText();

    const fileName = file.getBaseName();

    return `${baseLanguage} - ${fileName}`;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationsFromJson };

// #endregion Exports
