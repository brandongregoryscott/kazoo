import { addKeyToInterface } from "../commands/add-key-to-interface";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const CommandMap: Record<string, (...args: any[]) => any> = {
    "i18n-ext.addKeyToInterface": addKeyToInterface,
};

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { CommandMap };

// #endregion Exports
