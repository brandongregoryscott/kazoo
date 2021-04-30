import { ExtensionConfiguration } from "../interfaces/extension-configuration";
import * as vscode from "vscode";
import { ConfigUtils } from "../utilities/config-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const { defaultConfig } = ConfigUtils;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const TestUtils = {
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
            config.update(getSettingKey(key), updated[key])
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

const getSettingKey = (setting: string) => `${ConfigUtils.key}.${setting}`;

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { TestUtils };

// #endregion Exports
