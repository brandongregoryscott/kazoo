import { Property } from "../types/property";
import { NodeUtils } from "./node-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

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
    quoteEscape,
    quoteEscapeIfNeeded,
    stripQuotes,
};

// #endregion Exports
