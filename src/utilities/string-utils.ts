import { LanguageCodeMap } from "../constants/language-code-map";
import { Language } from "../enums/language";
import { Property } from "../types/property";
import { NodeUtils } from "./node-utils";
import translate, {
    IOptions as TranslateOptions,
} from "@vitalets/google-translate-api";
import { LanguageCode } from "../enums/language-code";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const StringUtils = {
    isJsonFile(fileName: string): boolean {
        return fileName.endsWith(".json");
    },
    matchLanguageCode(variableName?: string): LanguageCode | undefined {
        if (variableName == null) {
            return undefined;
        }
        const languages = Object.keys(LanguageCodeMap) as Language[];

        const matchingLanguage = languages.find((language: Language) =>
            new RegExp(language).test(variableName)
        );

        if (matchingLanguage == null) {
            return undefined;
        }

        return LanguageCodeMap[matchingLanguage];
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
    async translate(
        value: string,
        options?: TranslateOptions
    ): Promise<string> {
        const { text } = await translate(value, options);
        return text;
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { StringUtils };

// #endregion Exports
