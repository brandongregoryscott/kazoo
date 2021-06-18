import { Commands } from "../constants/commands";
import { log, logPath } from "./log";
import { WindowUtils } from "./window-utils";
import * as vscode from "vscode";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const CoreUtils = {
    catch(functionName: keyof typeof Commands, error: any): undefined {
        log.error(`[${functionName}]:`, error);

        WindowUtils.error(
            "An error occurred running command, see log file for more detail.",
            { value: "View log", onSelection: openLogFile }
        );

        return undefined;
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const openLogFile = async () =>
    await vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(logPath)
    );

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { CoreUtils };

// #endregion Exports
