import { LanguageCodeMap } from "../constants/language-code-map";
import { Property } from "../types/property";
import { NodeUtils } from "./node-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const matchLanguageCode = (variableName?: string): string | undefined => {
    if (variableName == null) {
        return undefined;
    }

    const patterns = Object.keys(LanguageCodeMap);

    let languageCode: string | undefined = undefined;
    patterns.forEach((pattern) => {
        if (languageCode != null || !new RegExp(pattern).test(variableName)) {
            return;
        }

        languageCode = LanguageCodeMap[pattern];
    });

    return languageCode;
};

const quoteEscape = (value: string): string => {
    const quote = `"`;

    if (!value.startsWith(quote)) {
        value = `${quote}${value}`;
    }

    if (!value.endsWith(`"`)) {
        value = `${value}${quote}`;
    }

    return value;
};

const quoteEscapeIfNeeded = (value: string, properties: Property[]): string =>
    NodeUtils.shouldQuoteEscapeNewProperty(value, properties)
        ? quoteEscape(value)
        : stripQuotes(value);

const stripQuotes = (value: string) => value.replace(/["']/g, "");

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const StringUtils = {
    matchLanguageCode,
    quoteEscape,
    quoteEscapeIfNeeded,
    stripQuotes,
};

// #endregion Exports
