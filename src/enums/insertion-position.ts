// -----------------------------------------------------------------------------------------
// #region Enums
// -----------------------------------------------------------------------------------------

enum InsertionPosition {
    /**
     * Inserts key at the end of the file/object
     */
    End = "End",
    /**
     * Inserts key in best guess alphabetical order (Assumes file is already sorted - fastest)
     */
    LooseAlphabetical = "Loose Alphabetical",
    /**
     * Inserts key at the start of the file/object
     */
    Start = "Start",
    /**
     * Inserts key in alphabetical order (Performs a full sort on file - slower)
     */
    StrictAlphabetical = "Strict Alphabetical",
}

// #endregion Enums

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { InsertionPosition };

// #endregion Exports
