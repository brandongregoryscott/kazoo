import { ExtensionConfiguration } from "../interfaces/extension-configuration";
import vscode from "vscode";
import { ConfigUtils } from "../utilities/config-utils";
import shell from "shelljs";
import upath from "upath";
import faker from "faker";
import { WorkspaceUtils } from "../utilities/workspace-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const { defaultConfig } = ConfigUtils;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Enums
// -----------------------------------------------------------------------------------------

enum TestFixtures {
    Empty = "empty",
    FiveKeysAlphabetized = "5-keys-alphabetized",
    SixHundredKeys = "600-keys",
}

// #endregion Enums

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const TestUtils = {
    copyFixturesToTmpDirectory(fixture: TestFixtures): string {
        setShelljsFatal(true);

        const workspace = WorkspaceUtils.getFolder();
        const tmpDirectory = upath.join("tmp", faker.datatype.uuid());
        const absoluteTmpDirectory = upath.join(workspace, tmpDirectory);
        const fixturesDirectory = upath.join(workspace, "fixtures", fixture);

        // Ensure temporary directory exists
        shell.mkdir("-p", absoluteTmpDirectory);
        shell.cp("-R", fixturesDirectory, absoluteTmpDirectory);

        setShelljsFatal(false);

        // Configuration expects relative path
        return tmpDirectory;
    },
    cleanTmpDirectory(): void {
        setShelljsFatal(true);
        shell.rm("-rf", upath.join(WorkspaceUtils.getFolder(), "tmp", "*"));
        setShelljsFatal(false);
    },
    getInterfacePath(tmpDirectory: string): string {
        return upath.join(tmpDirectory, "**", "interfaces", "*.ts");
    },
    getCultureFilePaths(tmpDirectory: string): string[] {
        return [upath.join(tmpDirectory, "**", "cultures", "*.ts")];
    },
    async mergeConfig(
        updated: Partial<ExtensionConfiguration>
    ): Promise<void[]> {
        const existing = await ConfigUtils.get();
        return this.setConfig({ ...existing, ...updated });
    },
    async setConfig(updated: ExtensionConfiguration): Promise<void[]> {
        const config = vscode.workspace.getConfiguration(ConfigUtils.key);
        const keys = Object.keys(updated) as Array<
            keyof ExtensionConfiguration
        >;

        const updateConfigByKey = (key: keyof ExtensionConfiguration) =>
            config.update(key, updated[key]);

        const configUpdates = keys.map(updateConfigByKey);
        return await Promise.all(configUpdates);
    },
    async resetConfig(): Promise<void[]> {
        return this.setConfig(defaultConfig);
    },
};
// #endregion Public Functions

const setShelljsFatal = (fatal: boolean) => (shell.config.fatal = fatal);

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { TestUtils, TestFixtures };

// #endregion Exports
