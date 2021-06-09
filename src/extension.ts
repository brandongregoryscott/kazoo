import "anylogger-log4js";
import * as vscode from "vscode";
import { CommandMap } from "./constants/command-map";
import { ProjectUtils } from "./utilities/project-utils";
import { addKeyToInterface } from "./commands/add-key-to-interface";
import { addKeyAndTranslation } from "./commands/add-key-and-translation";
import { addTranslationToCultureFiles } from "./commands/add-translation-to-culture-files";
import { replaceTranslationsFromJson } from "./commands/replace-translations-from-json";

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

export {
    activate,
    addKeyAndTranslation,
    addKeyToInterface,
    addTranslationToCultureFiles,
    deactivate,
    replaceTranslationsFromJson,
};

// #endregion Exports
