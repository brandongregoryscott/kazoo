import { SourceFile } from "ts-morph";
import * as vscode from "vscode";
import { SharedConstants } from "../constants/shared-constants";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const { RESOURCES } = SharedConstants;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const WindowUtils = {
    error(value: string) {
        return vscode.window.showErrorMessage(value);
    },
    errorResourcesNotFound(file: SourceFile) {
        const fileName = file.getBaseName();
        const message = `Expected to find object literal with key '${RESOURCES}' in ${fileName}.`;
        return this.error(message);
    },
    info(value: string) {
        return vscode.window.showInformationMessage(value);
    },
    prompt(prompt: string) {
        return vscode.window.showInputBox({
            prompt,
            ignoreFocusOut: true,
        });
    },
    selection(options: string[]) {
        return vscode.window.showQuickPick(options, {
            ignoreFocusOut: true,
        });
    },
    warning(value: string) {
        return vscode.window.showWarningMessage(value);
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { WindowUtils };

// #endregion Exports
