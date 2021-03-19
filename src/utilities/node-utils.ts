import {
    Node,
    ObjectLiteralExpression,
    PropertyAssignment,
    PropertyAssignmentStructure,
    PropertySignature,
    PropertySignatureStructure,
} from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const findObjectLiteralExpressionWithProperty = (
    nodes: Node[] | undefined,
    property: string
): ObjectLiteralExpression | undefined =>
    nodes?.find((node) =>
        isObjectLiteralExpressionWithProperty(node, property)
    ) as ObjectLiteralExpression | undefined;

const getPropertyAssignments = (
    literal: ObjectLiteralExpression
): PropertyAssignment[] =>
    literal
        .getProperties()
        .filter((node) =>
            Node.isPropertyAssignment(node)
        ) as PropertyAssignment[];

const isObjectLiteralExpressionWithProperty = (
    node: Node,
    property: string
): node is ObjectLiteralExpression =>
    Node.isObjectLiteralExpression(node) && node.getProperty(property) != null;

const sortAndReplaceProperties = (
    literal: ObjectLiteralExpression
): ObjectLiteralExpression => {
    const existing = getPropertyAssignments(literal);
    const sorted = sortPropertiesByName<
        PropertyAssignment,
        PropertyAssignmentStructure
    >(existing);
    existing.forEach((property) => property.remove());
    literal.addProperties(sorted);

    return literal;
};

const sortPropertiesByName = <
    TProperty extends PropertyAssignment | PropertySignature,
    TPropertyStructure extends
        | PropertyAssignmentStructure
        | PropertySignatureStructure
>(
    properties: TProperty[]
) =>
    properties
        .sort((a, b) =>
            a
                .getName()
                .replace(/['"]/g, "")
                .localeCompare(b.getName().replace(/['"]/g, ""))
        )
        .map((property) => property.getStructure() as TPropertyStructure);

const shouldQuoteEscapeNewProperty = (
    name: string,
    existing: PropertyAssignment[]
): boolean => {
    // If the property name has spaces or dashes, it will need to be quote escaped to be valid TS.
    if (name.includes(" ") || name.includes("-")) {
        return true;
    }

    if (
        // If every property starts & ends with quotes, it must be an enforced style. Keep it consistent.
        existing.every((property) =>
            property.getName().match(/["']{1}[a-zA-Z0-9 _\-]+["']{1}/)
        )
    ) {
        return true;
    }

    return false;
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const NodeUtils = {
    findObjectLiteralExpressionWithProperty,
    getPropertyAssignments,
    isObjectLiteralExpressionWithProperty,
    sortAndReplaceProperties,
    sortPropertiesByName,
    shouldQuoteEscapeNewProperty,
};

// #endregion Exports
