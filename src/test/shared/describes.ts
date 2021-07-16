import { InsertionPosition } from "../../enums/insertion-position";
import { beforeEach, describe } from "mocha";
import { TestUtils } from "../test-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const whenEndPosition = (fn: () => void) =>
    whenInsertionPosition(InsertionPosition.End)(fn);

const whenLooseAlphabetical = (fn: () => void) =>
    whenInsertionPosition(InsertionPosition.LooseAlphabetical)(fn);

const whenStartPosition = (fn: () => void) =>
    whenInsertionPosition(InsertionPosition.Start)(fn);

const whenStrictAlphabetical = (fn: () => void) =>
    whenInsertionPosition(InsertionPosition.StrictAlphabetical)(fn);

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const whenInsertionPosition = (insertionPosition: InsertionPosition) => (
    fn: () => void
) =>
    describe(`when insertionPosition '${insertionPosition}'`, () => {
        beforeEach(async () => {
            await TestUtils.mergeConfig({
                insertionPosition,
            });
        });

        fn();
    });

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export {
    whenEndPosition,
    whenLooseAlphabetical,
    whenStartPosition,
    whenStrictAlphabetical,
};

// #endregion Exports
