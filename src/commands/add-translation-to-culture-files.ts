import { ConfigUtils } from "../utilities/config-utils";
import { ToastUtils } from "../utilities/toast-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";
import { printNode, PropertySignature } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addTranslationToCultureFiles = async (key?: string) => {
    const cultureInterface = await ProjectUtils.getCultureInterface();
    const cultureFiles = await ProjectUtils.getCultureFiles();

    // if (key == null || key.length <= 0) {
    //     key = await vscode.window.showInputBox({
    //         prompt: `Enter a key from ${cultureInterface.getName()} to insert into the culture files`,
    //     });
    // }

    // if (key == null) {
    //     return;
    // }

    // const englishCopy = await vscode.window.showInputBox({
    //     prompt: `Enter the English copy for key '${key}'`,
    // });

    // if (englishCopy == null) {
    //     return;
    // }

    cultureFiles.forEach((file) => {
        // Get the first variable exported - we should be able to assume that the exported value is the culture resource
        const cultureResource = file.getVariableDeclaration((variable) =>
            variable.isExported()
        );

        // If further comparison is needed, underlying type name can be compared like so:
        // variable.getType().getSymbol().getEscapedName() === "Culture"\

        const initializer = cultureResource?.getInitializerIfKind(
            SyntaxKind.CallExpression
        );
        console.log("initializer:", initializer);

        const objectLiteralArg = initializer
            ?.getArguments()
            ?.find((arg) =>
                arg.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)
            );
        console.log(objectLiteralArg);
    });
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
