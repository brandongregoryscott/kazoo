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
    error(value: string): void {
        vscode.window.showErrorMessage(value);
    },
    errorResourcesNotFound(file: SourceFile): void {
        const fileName = file.getBaseName();
        const message = `Expected to find object literal with key '${RESOURCES}' in ${fileName}.`;
        this.error(message);
    },
    info(value: string): void {
        vscode.window.showInformationMessage(value);
    },
    prompt(prompt: string): Thenable<string | undefined> {
        return vscode.window.showInputBox({
            prompt,
            ignoreFocusOut: true,
        });
    },
    selection(options: string[]): Thenable<string | undefined> {
        return vscode.window.showQuickPick(options, {
            ignoreFocusOut: true,
        });
    },
    warning(value: string): void {
        vscode.window.showWarningMessage(value);
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { WindowUtils };

// #endregion Exports
