import * as vscode from "vscode";
import { Project } from "ts-morph";
import { CommandMap } from "./constants/command-map";
import { ProjectUtils } from "./utilities/project-utils";
import { ToastUtils } from "./utilities/toast-utils";
import { addKeyToInterface } from "./commands/add-key-to-interface";

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
