import { ExtensionConfiguration } from "../interfaces/extension-configuration";
import * as vscode from "vscode";
import { ConfigUtils } from "../utilities/config-utils";
import * as shell from "shelljs";
import * as upath from "upath";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const { defaultConfig } = ConfigUtils;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const TestUtils = {
    copyFixturesToTmpDirectory(fixture: string): string {
        shell.config.fatal = true;
        const tmpDirectory = upath.toUnix(shell.tempdir());

        shell.cp(
            "-R",
            upath.join(getWorkspaceFolder(), "fixtures", fixture, "*"),
            tmpDirectory
        );

        return tmpDirectory;
    },
    async mergeConfig(updated: Partial<ExtensionConfiguration>) {
        const existing = await ConfigUtils.get();
        return this.setConfig({ ...existing, ...updated });
    },
    async setConfig(updated: ExtensionConfiguration) {
        const config = vscode.workspace.getConfiguration(ConfigUtils.key);
        const keys = Object.keys(updated) as Array<
            keyof ExtensionConfiguration
        >;
        const configUpdates = keys.map((key: keyof ExtensionConfiguration) =>
            config.update(key, updated[key])
        );
        return await Promise.all(configUpdates);
    },
    async resetConfig() {
        return this.setConfig(defaultConfig);
    },
};
// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const getWorkspaceFolder = () =>
    upath.toUnix(vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath ?? "");

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { TestUtils };

// #endregion Exports
