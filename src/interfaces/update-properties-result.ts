// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface UpdatePropertiesResult {
    /**
     * Properties found in the 'updated' collection that do not exist in the original collection
     */
    notFound: string[];

    /**
     * Properties found that have not changed in value
     */
    unmodified: string[];

    /**
     * Properties successfully updated
     */
    updated: string[];
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { UpdatePropertiesResult };

// #endregion Exports
