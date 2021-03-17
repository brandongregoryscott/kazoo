import { ConfigUtils } from "../utilities/config-utils";
import { ToastUtils } from "../utilities/toast-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";
import { PropertySignature } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addTranslationToCultureFiles = async () => {
    const cultureInterface = await ProjectUtils.getCultureInterface();
    const cultureFiles = await ProjectUtils.getCultureFiles();
    const key = await vscode.window.showInputBox({
        prompt: `Enter a key from ${cultureInterface.getName()} to insert into the culture files`,
    });

    if (key == null) {
        return;
    }

    const englishCopy = await vscode.window.showInputBox({
        prompt: `Enter the English copy for key '${key}'`,
    });

    if (englishCopy == null) {
        return;
    }

    console.log(cultureFiles);
    console.log(key, englishCopy);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addTranslationToCultureFiles };

// #endregion Exports
