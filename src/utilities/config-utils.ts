import { ExtensionConfiguration } from "../interfaces/extension-configuration";
import * as vscode from "vscode";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const defaultConfig: ExtensionConfiguration = {
    cultureFilePaths: ["**/cultures/*.ts"],
    cultureInterfacePath: "**/interfaces/culture-resources.ts",
    insertionPosition: InsertionPosition.LooseAlphabetical,
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const get = (): ExtensionConfiguration =>
    vscode.workspace
        .getConfiguration()
        .get<ExtensionConfiguration>("i18n-ext") ?? defaultConfig;

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const ConfigUtils = {
    get,
};

// #endregion Exports
