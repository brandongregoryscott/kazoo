import { ExtensionConfiguration } from "../interfaces/extension-configuration";
import * as vscode from "vscode";
import { InsertionPosition } from "../enums/insertion-position";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const defaultConfig: ExtensionConfiguration = {
    cultureFilePaths: ["**/cultures/*.ts"],
    cultureInterfacePath: "**/interfaces/culture-resources.ts",
    insertionPosition: InsertionPosition.LooseAlphabetical,
};

const key = "kazoo";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const get = (): ExtensionConfiguration =>
    vscode.workspace.getConfiguration().get<ExtensionConfiguration>(key) ??
    defaultConfig;

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const ConfigUtils = {
    defaultConfig,
    key,
    get,
};

// #endregion Exports
