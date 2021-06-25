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
        const workspaceRoot = appendTestDirectoryIfCI(workspace!);

        const tmpDirectory = upath.join("tmp", faker.datatype.uuid());
        const sourceFixtures = upath.join(workspaceRoot, "fixtures", fixture);
        const destinationFixtures = upath.join(workspaceRoot, tmpDirectory);

        // Ensure temporary directory exists
        shell.mkdir("-p", destinationFixtures);
        shell.cp("-R", sourceFixtures, destinationFixtures);

        setShelljsFatal(false);

        // Configuration expects relative path
        return appendTestDirectoryIfCI(tmpDirectory);
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
    isCI(): boolean {
        const ci = process.env["CI"];
        return ci != null && ci.toLowerCase() === "true";
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

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const appendTestDirectoryIfCI = (path: string): string =>
    TestUtils.isCI() ? upath.join("src", "test", path) : path;

const setShelljsFatal = (fatal: boolean) => (shell.config.fatal = fatal);

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { TestUtils, TestFixtures };

// #endregion Exports
