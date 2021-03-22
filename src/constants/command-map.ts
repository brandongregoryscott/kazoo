import { addKeyAndTranslation } from "../commands/add-key-and-translation";
import { addKeyToInterface } from "../commands/add-key-to-interface";
import { addTranslationToCultureFiles } from "../commands/add-translation-to-culture-files";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const CommandMap: Record<string, (...args: any[]) => any> = {
    "kazoo.addKeyAndTranslation": addKeyAndTranslation,
    "kazoo.addKeyToInterface": addKeyToInterface,
    "kazoo.addTranslationToCultureFiles": addTranslationToCultureFiles,
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { CommandMap };

// #endregion Exports
