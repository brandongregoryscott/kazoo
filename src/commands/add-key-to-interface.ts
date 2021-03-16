import { ConfigUtils } from "../utilities/config-utils";
import { ToastUtils } from "../utilities/toast-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyToInterface = async () => {
    const cultureInterfaceFile = await ProjectUtils.getCultureInterface();
    const cultureInterface = cultureInterfaceFile.getChildrenOfKind(
        SyntaxKind.InterfaceDeclaration
    );

    console.log(cultureInterface);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addKeyToInterface };

// #endregion Exports
