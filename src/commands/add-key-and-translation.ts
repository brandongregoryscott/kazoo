import { Commands } from "../constants/commands";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { addKeyToInterface } from "./add-key-to-interface";
import { addTranslationToCultureFiles } from "./add-translation-to-culture-files";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyAndTranslation = async (key?: string, translation?: string) => {
    try {
        key = await addKeyToInterface(key);
        if (key == null) {
            log.debug(
                `Key from ${Commands.addKeyToInterface} returned: ${key}`
            );
            return;
        }

        return await addTranslationToCultureFiles(key, translation);
    } catch (error) {
        CoreUtils.catch("addKeyAndTranslation", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addKeyAndTranslation };

// #endregion Exports
