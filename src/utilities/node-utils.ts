import {
    Node,
    ObjectLiteralExpression,
    PropertyAssignment,
    PropertyAssignmentStructure,
} from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const alphabetizeProperties = (
    properties: PropertyAssignment[]
): PropertyAssignmentStructure[] =>
    properties
        .sort((a, b) =>
            a
                .getName()
                .replace(/['"]/g, "")
                .localeCompare(b.getName().replace(/['"]/g, ""))
        )
        .map((property) => property.getStructure());

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
    alphabetizeProperties,
    findObjectLiteralExpressionWithProperty,
    getPropertyAssignments,
    isObjectLiteralExpressionWithProperty,
    shouldQuoteEscapeNewProperty,
};

// #endregion Exports
