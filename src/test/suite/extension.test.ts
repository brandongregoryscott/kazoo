import * as assert from "assert";
import * as vscode from "vscode";
import { describe } from "mocha";
import * as kazoo from "../../extension";
import { TestUtils } from "../test-utils";

const workspaceFolder = `${__dirname}/../../../src/test/`;

suite("kazoo", () => {
    const shouldActivate = async () => {
        // Arrange
        const extension = vscode.extensions.getExtension(
            "brandongregoryscott.kazoo"
        );

        // Act & Assert
        await extension?.activate();
        assert.equal(extension?.isActive, true);
    };

    test("should activate extension", shouldActivate);

    // -----------------------------------------------------------------------------------------
    // #region addKeyToInterface
    // -----------------------------------------------------------------------------------------

    describe("addKeyToInterface", () => {
        test("inserts key into interface", async () => {
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
