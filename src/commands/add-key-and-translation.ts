import { addKeyToInterface } from "./add-key-to-interface";
import { addTranslationToCultureFiles } from "./add-translation-to-culture-files";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyAndTranslation = async (key?: string, translation?: string) => {
    key = await addKeyToInterface(key);
    if (key == null) {
        return;
    }

    await addTranslationToCultureFiles(key, translation);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addKeyAndTranslation };

// #endregion Exports
