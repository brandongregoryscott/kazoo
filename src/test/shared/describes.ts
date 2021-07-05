import { InsertionPosition } from "../../enums/insertion-position";
import { Suite, describe } from "mocha";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const whenEndPosition = (fn: (this: Suite) => void) =>
    whenInsertionPosition(InsertionPosition.End)(fn);

const whenLooseAlphabetical = (fn: (this: Suite) => void) =>
    whenInsertionPosition(InsertionPosition.LooseAlphabetical)(fn);

const whenStartPosition = (fn: (this: Suite) => void) =>
    whenInsertionPosition(InsertionPosition.Start)(fn);

const whenStrictAlphabetical = (fn: (this: Suite) => void) =>
    whenInsertionPosition(InsertionPosition.StrictAlphabetical)(fn);

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const whenInsertionPosition = (insertionPosition: InsertionPosition) => (
    fn: (this: Suite) => void
) => describe(`when insertionPosition '${insertionPosition}'`, fn);

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
