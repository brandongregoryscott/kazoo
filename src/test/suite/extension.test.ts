import * as assert from "assert";
import * as vscode from "vscode";
import { describe, afterEach, beforeEach } from "mocha";
import * as kazoo from "../../extension";
import * as shell from "shelljs";
import * as upath from "upath";
import { TestUtils } from "../test-utils";

suite("kazoo", () => {
    // -----------------------------------------------------------------------------------------
    // #region Setup
    // -----------------------------------------------------------------------------------------

    // const cleanupFixtures = () => {
    //     const workspaceDirectory =
    //         vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    //     const fixturesDirectory = upath.join(workspaceDirectory, "fixtures");

    //     // Manually set node execPath (see https://github.com/shelljs/shelljs/wiki/Electron-compatibility)
    //     shell.config.execPath = shell.which("node").toString();
    //     shell.cd(fixturesDirectory);
    //     shell.exec("git checkout .");
    // };

    const shouldActivate = async () => {
        // Arrange
        const extension = vscode.extensions.getExtension(
            "brandongregoryscott.kazoo"
        );

        // Act
        await extension?.activate();

        // Assert
        assert.equal(extension?.isActive, true);
    };

    // #endregion Setup

    test("should activate extension", shouldActivate);

    // -----------------------------------------------------------------------------------------
    // #region addKeyToInterface
    // -----------------------------------------------------------------------------------------

    describe("addKeyToInterface", () => {
        // beforeEach(() => {
        //     cleanupFixtures();
        // });

        // afterEach(() => {
        //     cleanupFixtures();
        // });

        describe("given interface is empty", () => {
            let tmpDirectory: string;
            beforeEach(async () => {
                tmpDirectory = TestUtils.copyFixturesToTmpDirectory("empty");
                console.log("tmpDirectory:", tmpDirectory);
                await TestUtils.mergeConfig({
                    cultureInterfacePath: `${tmpDirectory}/**/interfaces/*.ts`,
                    cultureFilePaths: [`${tmpDirectory}/**/cultures/*.ts`],
                });
            });

            test("inserts key into interface, returns created key", async () => {
                // Arrange
                const key = "testKey";

                // Act
                const result = await kazoo.addKeyToInterface(key);

                // Assert
                assert.equal(result, key);
            });
        });
    });

    // #endregion addKeyToInterface
});
