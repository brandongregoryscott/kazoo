import assert from "assert";
import * as vscode from "vscode";
// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const shouldActivate = async () => {
    // Arrange
    const extension = vscode.extensions.getExtension(
        "brandongregoryscott.kazoo"
    );

    // Act
    await extension?.activate();

    // Assert
    assert.strictEqual(extension?.isActive, true);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { shouldActivate };

// #endregion Exports
