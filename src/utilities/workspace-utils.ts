import * as vscode from "vscode";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const WorkspaceUtils = {
    getFolder(): string | undefined {
        return vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { WorkspaceUtils };

// #endregion Exports
