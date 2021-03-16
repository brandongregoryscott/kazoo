import * as vscode from "vscode";
import { ConfigUtils } from "./utilities/config-utils";
import { ToastUtils } from "./utilities/toast-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const activate = (context: vscode.ExtensionContext) => {
    let disposable = vscode.commands.registerCommand(
        "i18n-ext.helloWorld",
        command
    );

    context.subscriptions.push(disposable);
};

const command = async () => {
    const config = ConfigUtils.get();

    const interfacePath = (
        await vscode.workspace.findFiles(
            config.cultureInterfacePath,
            "**/node_modules/**",
            1
        )
    )[0];

    if (interfacePath == null) {
        ToastUtils.error(
            `Error - culture interface could not be found matching path ${config.cultureInterfacePath}. Please check the path in your settings.`
        );

        return;
    }

    ToastUtils.info(`Found culture interface - ${interfacePath.toString()}`);
};

const deactivate = () => {};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { activate, deactivate };

// #endregion Exports
