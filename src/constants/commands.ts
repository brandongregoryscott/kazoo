// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const kazooDot = (command: string): string => `kazoo.${command}`;

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const Commands = {
    addKeyToInterface: kazooDot("addKeyToInterface"),
    addKeyAndTranslation: kazooDot("addKeyAndTranslation"),
    addTranslationToCultureFiles: kazooDot("addTranslationToCultureFiles"),
    intersectUntranslatedKeys: kazooDot("intersectUntranslatedKeys"),
    removeKeyFromInterface: kazooDot("removeKeyFromInterface"),
    removeTranslationFromCultureFiles: kazooDot(
        "removeTranslationFromCultureFiles"
    ),
    replaceTranslationByKey: kazooDot("replaceTranslationByKey"),
    replaceTranslationsFromFile: kazooDot("replaceTranslationsFromFile"),
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { Commands };

// #endregion Exports
