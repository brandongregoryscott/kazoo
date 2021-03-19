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

const stripQuotes = (value: string) => value.replace(/["']/g, "");

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const StringUtils = {
    quoteEscape,
    stripQuotes,
};

// #endregion Exports
