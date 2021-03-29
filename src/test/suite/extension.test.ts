import * as assert from "assert";
import * as vscode from "vscode";
import { describe } from "mocha";
import * as kazoo from "../../extension";

suite("kazoo", () => {
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
