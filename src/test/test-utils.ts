import { ExtensionConfiguration } from "../interfaces/extension-configuration";
import * as vscode from "vscode";
import { ConfigUtils } from "../utilities/config-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const { key, defaultConfig } = ConfigUtils;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const TestUtils = {
    async mergeConfig(updated: Partial<ExtensionConfiguration>) {
        const existing = await ConfigUtils.get();
        return this.setConfig({ ...existing, ...updated });
    },
    async setConfig(config: ExtensionConfiguration) {
        return vscode.workspace
            .getConfiguration()
            .update(key, config, vscode.ConfigurationTarget.Global);
    },
    async resetConfig() {
        return this.setConfig(defaultConfig);
    },
};
// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { TestUtils };

// #endregion Exports
