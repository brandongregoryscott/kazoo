import { LanguageCodeMap } from "../constants/language-code-map";
import { Property } from "../types/property";
import { NodeUtils } from "./node-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const StringUtils = {
    isJsonFile(fileName: string): boolean {
        return fileName.endsWith(".json");
    },
    matchLanguageCode(variableName?: string): string | undefined {
        if (variableName == null) {
            return undefined;
        }

        const patterns = Object.keys(LanguageCodeMap);

        let languageCode: string | undefined = undefined;
        patterns.forEach((pattern) => {
            if (
                languageCode != null ||
                !new RegExp(pattern).test(variableName)
            ) {
                return;
            }

            languageCode =
                LanguageCodeMap[pattern as keyof typeof LanguageCodeMap];
        });

        return languageCode;
    },
    quoteEscape(value: string): string {
        const quote = `"`;

        if (!value.startsWith(quote)) {
            value = `${quote}${value}`;
        }

        if (!value.endsWith(`"`)) {
            value = `${value}${quote}`;
        }

        return value;
    },
    quoteEscapeIfNeeded(value: string, properties: Property[]): string {
        return NodeUtils.shouldQuoteEscapeNewProperty(value, properties)
            ? this.quoteEscape(value)
            : this.stripQuotes(value);
    },
    stripQuotes(value: string): string {
        return value.replace(/["']/g, "");
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { StringUtils };

// #endregion Exports
