import { TestFixtures, TestUtils } from "../test-utils";
import { beforeEach } from "mocha";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

/**
 * Copies the given test fixture to a temporary directory and sets the configuration to match
 */
const useFixture = (fixture: TestFixtures) => {
    beforeEach(async () => {
        TestUtils.cleanTmpDirectory();

        const tmpDirectory = TestUtils.copyFixturesToTmpDirectory(fixture);

        await TestUtils.mergeConfigForTmpDirectory(tmpDirectory);
    });
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { useFixture };

// #endregion Exports
