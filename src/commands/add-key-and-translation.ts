import { addKeyToInterface } from "./add-key-to-interface";
import { addTranslationToCultureFiles } from "./add-translation-to-culture-files";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyAndTranslation = async () => {
    const key = await addKeyToInterface();
    if (key == null) {
        return;
    }

    await addTranslationToCultureFiles(key);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addKeyAndTranslation };

// #endregion Exports
