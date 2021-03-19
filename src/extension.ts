import * as vscode from "vscode";
import { CommandMap } from "./constants/command-map";
import { ProjectUtils } from "./utilities/project-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const activate = async (context: vscode.ExtensionContext) => {
    await ProjectUtils.initializeFromConfig();
    Object.keys(CommandMap).forEach((command: string) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(command, CommandMap[command])
        );
    });
};

const deactivate = () => {};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { activate, deactivate };

// #endregion Exports
