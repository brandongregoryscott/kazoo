// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

/**
 * Mapping variable name patterns to Google Translate API supported language codes
 *
 * Note: intentionally making the patterns loosely match since Google Translate does not seem to
 * support specific locale variants of languages
 */
const LanguageCodeMap: Record<string, string> = {
    "*English*": "en",
    "*Spanish*": "es",
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { LanguageCodeMap };

// #endregion Exports
