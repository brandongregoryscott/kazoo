import * as assert from "assert";
import * as vscode from "vscode";
import { describe, afterEach, beforeEach } from "mocha";
import * as kazoo from "../../extension";
import * as shell from "shelljs";
import * as upath from "upath";
import { TestFixtures, TestUtils } from "../test-utils";
import { ProjectUtils } from "../../utilities/project-utils";

suite("kazoo", () => {
    // -----------------------------------------------------------------------------------------
    // #region Setup
    // -----------------------------------------------------------------------------------------

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
        beforeEach(() => {
            TestUtils.cleanTmpDirectory();
        });

        describe("given interface is empty", () => {
            let tmpDirectory: string;
            beforeEach(async () => {
                tmpDirectory = TestUtils.copyFixturesToTmpDirectory(
                    TestFixtures.Empty
                );
                const cultureInterfacePath = TestUtils.getInterfacePath(
                    tmpDirectory
                );
                const cultureFilePaths = TestUtils.getCultureFilePaths(
                    tmpDirectory
                );

                await TestUtils.mergeConfig({
                    cultureInterfacePath,
                    cultureFilePaths,
                });

                await shouldActivate();
            });

            test("inserts key into interface, returns created key", async () => {
                // Arrange
                const key = "testKey";

                // Act
                const result = await kazoo.addKeyToInterface(key);
                const cultureInterface = await ProjectUtils.getCultureInterface();

                // Assert
                assert.equal(result, key);
                cultureInterface.getPropertyOrThrow(key);
            });
        });
    });

    // #endregion addKeyToInterface
});
