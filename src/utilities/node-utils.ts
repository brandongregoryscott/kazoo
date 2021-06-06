import {
    Identifier,
    InterfaceDeclaration,
    Node,
    ObjectLiteralExpression,
    OptionalKind,
    PropertyAssignment,
    PropertyAssignmentStructure,
    PropertySignatureStructure,
} from "ts-morph";
import { InsertionPosition } from "../enums/insertion-position";
import { Property } from "../types/property";
import * as _ from "lodash";
import { StringUtils } from "./string-utils";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface UpdatePropertiesResult {
    /**
     * Properties found in the 'updated' collection that do not exist in the original collection
     */
    notFoundProperties: string[];
    unmodifiedProperties: string[];
    updatedProperties: string[];
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const findPropertyByName = (
    name: string,
    properties: Property[]
): Property | undefined => {
    const names = properties.map((property) => _trimPropertyName(property));
    const index = names.indexOf(name);
    return properties[index];
};

const findIndex = (
    position: InsertionPosition,
    name: string,
    properties: Property[]
): number => {
    if (position === InsertionPosition.Start) {
        return 0;
    }

    if (position === InsertionPosition.End) {
        return properties.length;
    }

    // If position is alphabetical, we'll assume the consumer is handling 'strict' alphabetization
    // due to reordering of entire property array
    const names = [
        ...properties.map((property) => _trimPropertyName(property)),
        name,
    ].sort();

    return names.indexOf(name);
};

const findIdentifier = (nodes?: Node[]): Identifier | undefined =>
    nodes?.find((node) => Node.isIdentifier(node)) as Identifier | undefined;

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

const mapToPropertyAssignments = (
    object: Record<string, string>,
    existingProperties: Property[]
): Array<OptionalKind<PropertyAssignmentStructure>> =>
    Object.entries(object).map(([key, value]) => ({
        name: StringUtils.quoteEscapeIfNeeded(key, existingProperties),
        initializer: StringUtils.quoteEscape(value),
    }));

const updateProperties = (
    existing: Property[],
    updated: Array<OptionalKind<PropertyAssignmentStructure>>
): UpdatePropertiesResult => {
    const diffByInitializer = (
        existing: Property,
        updated: OptionalKind<PropertyAssignmentStructure>
    ) => existing.getInitializer()?.getText() !== updated.initializer;

    const compareByName = (
        existing: Property,
        updated: OptionalKind<PropertyAssignmentStructure>
    ) => existing.getName() === updated.name;

    const diffByNameAndInitializer = (
        existing: Property,
        updated: OptionalKind<PropertyAssignmentStructure>
    ) =>
        compareByName(existing, updated) &&
        diffByInitializer(existing, updated);

    const propertiesToUpdate = _.intersectionWith(
        existing,
        updated,
        diffByNameAndInitializer
    );

    const unmodifiedProperties = _.differenceWith(
        existing,
        updated,
        diffByNameAndInitializer
    );

    const extraProperties = _.differenceWith(
        updated,
        existing,
        (updated, existing) => compareByName(existing, updated)
    );

    const updateProperty = (existingProperty: Property) => {
        const updatedProperty = updated.find((updatedProperty) =>
            compareByName(existingProperty, updatedProperty)
        );
        if (updatedProperty == null) {
            return;
        }

        existingProperty.setInitializer(updatedProperty.initializer);
    };

    propertiesToUpdate.forEach(updateProperty);

    return {
        notFoundProperties: extraProperties.map((property) => property.name),
        unmodifiedProperties: unmodifiedProperties.map((property) =>
            property.getName()
        ),
        updatedProperties: propertiesToUpdate.map((property) =>
            property.getName()
        ),
    };
};

const sortPropertyAssignments = (
    literal: ObjectLiteralExpression
): ObjectLiteralExpression => {
    const existing = getPropertyAssignments(literal);
    const sorted = sortPropertiesByName<PropertyAssignmentStructure>(existing);
    existing.forEach((property) => property.remove());
    literal.addProperties(sorted);

    return literal;
};

const sortPropertySignatures = (
    _interface: InterfaceDeclaration
): InterfaceDeclaration => {
    const existing = _interface.getProperties();
    const sorted = sortPropertiesByName<PropertySignatureStructure>(existing);
    existing.forEach((property) => property.remove());

    _interface.addProperties(sorted);
    return _interface;
};

const sortPropertiesByName = <
    TPropertyStructure extends
        | PropertyAssignmentStructure
        | PropertySignatureStructure
>(
    properties: Property[]
) =>
    properties
        .sort((a, b) =>
            _trimPropertyName(a).localeCompare(_trimPropertyName(b))
        )
        .map((property) => property.getStructure() as TPropertyStructure);

const shouldQuoteEscapeNewProperty = (
    name: string,
    existing: Property[]
): boolean => {
    // If the property name has spaces or dashes, it will need to be quote escaped to be valid TS.
    if (name.includes(" ") || name.includes("-")) {
        return true;
    }

    if (
        // If every property starts & ends with quotes, it must be an enforced style. Keep it consistent.
        existing.length > 0 &&
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
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _trimPropertyName = (property: Property) =>
    property.getName().replace(/['"]/g, "");

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const NodeUtils = {
    findIndex,
    findIdentifier,
    findObjectLiteralExpressionWithProperty,
    findPropertyByName,
    getPropertyAssignments,
    isObjectLiteralExpressionWithProperty,
    mapToPropertyAssignments,
    shouldQuoteEscapeNewProperty,
    sortPropertiesByName,
    sortPropertyAssignments,
    sortPropertySignatures,
    updateProperties,
};

// #endregion Exports
