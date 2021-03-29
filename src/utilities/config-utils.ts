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

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const get = (): ExtensionConfiguration =>
    vscode.workspace.getConfiguration().get<ExtensionConfiguration>("kazoo") ??
    defaultConfig;

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const ConfigUtils = {
    defaultConfig,
    get,
};

// #endregion Exports
