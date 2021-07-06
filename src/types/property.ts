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
type PropertyStructure<
    TProperty extends Property
> = TProperty extends PropertyAssignment
    ? PropertyAssignmentStructure
    : PropertySignatureStructure;

// #endregion Types

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { Property, PropertyStructure };

// #endregion Exports
