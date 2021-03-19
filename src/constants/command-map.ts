import { addKeyAndTranslation } from "../commands/add-key-and-translation";
import { addKeyToInterface } from "../commands/add-key-to-interface";
import { addTranslationToCultureFiles } from "../commands/add-translation-to-culture-files";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const CommandMap: Record<string, (...args: any[]) => any> = {
    "i18n-ext.addKeyAndTranslation": addKeyAndTranslation,
    "i18n-ext.addKeyToInterface": addKeyToInterface,
    "i18n-ext.addTranslationToCultureFiles": addTranslationToCultureFiles,
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { CommandMap };

// #endregion Exports
