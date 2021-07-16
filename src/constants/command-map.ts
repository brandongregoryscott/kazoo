import { addKeyAndTranslation } from "../commands/add-key-and-translation";
import { addKeyToInterface } from "../commands/add-key-to-interface";
import { addTranslationToCultureFiles } from "../commands/add-translation-to-culture-files";
import { removeKeyFromInterface } from "../commands/remove-key-from-interface";
import { replaceTranslationsFromFile } from "../commands/replace-translations-from-file";
import { Commands } from "./commands";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const CommandMap: Record<string, (...args: any[]) => any> = {
    [Commands.addKeyAndTranslation]: addKeyAndTranslation,
    [Commands.addKeyToInterface]: addKeyToInterface,
    [Commands.addTranslationToCultureFiles]: addTranslationToCultureFiles,
    [Commands.removeKeyFromInterface]: removeKeyFromInterface,
    [Commands.replaceTranslationsFromFile]: replaceTranslationsFromFile,
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { CommandMap };

// #endregion Exports
