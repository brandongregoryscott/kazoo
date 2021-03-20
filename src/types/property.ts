import {
    PropertyAssignment,
    PropertyAssignmentStructure,
    PropertySignature,
    PropertySignatureStructure,
} from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Types
// -----------------------------------------------------------------------------------------

type Property = PropertyAssignment | PropertySignature;
type PropertyAndStructure =
    | [PropertyAssignment, PropertyAssignmentStructure]
    | [PropertySignature, PropertySignatureStructure];

// #endregion Types

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { Property, PropertyAndStructure };

// #endregion Exports
