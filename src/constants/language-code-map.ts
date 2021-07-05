import { Language } from "../enums/language";
import { LanguageCode } from "../enums/language-code";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

/**
 * Mapping variable name patterns to Google Translate API supported language codes
 *
 * Note: intentionally making the patterns loosely match since Google Translate does not seem to
 * support specific locale variants of languages
 */
const LanguageCodeMap: Record<Language, LanguageCode> = {
    English: LanguageCode.English,
    Spanish: LanguageCode.Spanish,
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { LanguageCodeMap };

// #endregion Exports
