// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const DEFAULT_LANGUAGE_CODE = "en";

/**
 * Mapping variable name patterns to Google Translate API supported language codes
 *
 * Note: intentionally making the patterns loosely match since Google Translate does not seem to
 * support specific locale variants of languages
 */
const LanguageCodeMap = {
    English: "en",
    Spanish: "es",
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { DEFAULT_LANGUAGE_CODE, LanguageCodeMap };

// #endregion Exports
