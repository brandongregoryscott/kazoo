import * as assert from "assert";
import * as vscode from "vscode";
import { describe, afterEach, beforeEach } from "mocha";
import * as kazoo from "../../extension";
import * as shell from "shelljs";
import * as upath from "upath";

suite("kazoo", () => {
    // -----------------------------------------------------------------------------------------
    // #region Setup
    // -----------------------------------------------------------------------------------------

    const cleanupFixtures = () => {
        const workspaceDirectory =
            vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        const fixturesDirectory = upath.join(workspaceDirectory, "fixtures");

        shell.config.execPath = shell.which("node").toString();
        shell.cd(fixturesDirectory);
        shell.exec("git checkout .");
    };

    const shouldActivate = async () => {
        // Arrange
        const extension = vscode.extensions.getExtension(
            "brandongregoryscott.kazoo"
        );

        // Act & Assert
        await extension?.activate();
        assert.equal(extension?.isActive, true);
    };

    // #endregion Setup

    test("should activate extension", shouldActivate);

    // -----------------------------------------------------------------------------------------
    // #region addKeyToInterface
    // -----------------------------------------------------------------------------------------

    describe("addKeyToInterface", () => {
        beforeEach(() => {
            cleanupFixtures();
        });

        afterEach(() => {
            cleanupFixtures();
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

    // #endregion addKeyToInterface
});
