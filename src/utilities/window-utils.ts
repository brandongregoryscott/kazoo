import * as vscode from "vscode";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const WindowUtils = {
    error(value: string | object) {
        return _showMessage(value, vscode.window.showErrorMessage);
    },
    info(value: string | object) {
        return _showMessage(value, vscode.window.showInformationMessage);
    },
    prompt(prompt: string) {
        return vscode.window.showInputBox({
            prompt,
            ignoreFocusOut: true,
        });
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _showMessage = (
    value: string | object,
    fn: (message: string, ...items: string[]) => Thenable<string | undefined>
) => {
    if (typeof value !== "string") {
        value = JSON.stringify(value);
    }

    return fn(value);
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { WindowUtils };

// #endregion Exports
