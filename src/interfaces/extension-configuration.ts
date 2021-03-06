import { InsertionPosition } from "../enums/insertion-position";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface ExtensionConfiguration {
    cultureFilePaths: string[];
    cultureInterfacePath: string;
    insertionPosition: InsertionPosition;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { ExtensionConfiguration };

// #endregion Exports
