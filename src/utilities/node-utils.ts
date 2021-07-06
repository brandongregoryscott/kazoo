import {
    Identifier,
    InterfaceDeclaration,
    NamedNodeSpecificBase,
    Node,
    ObjectLiteralElementLike,
    ObjectLiteralExpression,
    OptionalKind,
    PropertyAssignment,
    PropertyAssignmentStructure,
    PropertySignature,
    PropertySignatureStructure,
} from "ts-morph";
import { InsertionPosition } from "../enums/insertion-position";
import { Property, PropertyStructure } from "../types/property";
import * as _ from "lodash";
import { StringUtils } from "./string-utils";
import { UpdatePropertiesResult } from "../interfaces/update-properties-result";
import { property } from "lodash";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const findPropertyByName = <TProperty extends Property>(
    name: string,
    properties: TProperty[]
): TProperty | undefined =>
    properties[findPropertyIndexByName(name, properties)];

const findPropertyIndexByName = <TProperty extends Property>(
    name: string,
    properties: TProperty[]
): number => {
    const names = properties.map(NodeUtils.getNameOrText);
    return names.indexOf(name);
};

const findIndex = (
    position: InsertionPosition,
    name: string,
    properties: Array<ObjectLiteralElementLike | PropertySignature>
): number => {
    if (position === InsertionPosition.Start) {
        return 0;
    }

    if (position === InsertionPosition.End) {
        return properties.length;
    }

    // If position is alphabetical, we'll assume the consumer is handling 'strict' alphabetization
    // due to reordering of entire property array
    const names = [...properties.map(NodeUtils.getNameOrText), name].sort();

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

const getNameOrText = <T extends Node>(node: T): string => {
    const nameOrText = Node.hasName(node) ? node.getName() : node.getText();
    return StringUtils.stripQuotes(nameOrText);
};

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

    const notFoundProperties = _.differenceWith(
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
        notFound: notFoundProperties.map((property) => property.name),
        unmodified: unmodifiedProperties.map((property) => property.getName()),
        updated: propertiesToUpdate.map((property) => property.getName()),
    };
};

const sortPropertyAssignments = (
    literal: ObjectLiteralExpression
): ObjectLiteralExpression => {
    const existing = getPropertyAssignments(literal);
    const sorted = sortPropertiesByName<PropertyAssignmentStructure>(existing);
    existing.filter(propertyOutOfOrder(sorted)).forEach(sortProperty(sorted));
    return literal;
};

const sortPropertySignatures = (
    _interface: InterfaceDeclaration
): InterfaceDeclaration => {
    const existing = _interface.getProperties();
    const sorted = sortPropertiesByName<PropertySignatureStructure>(existing);
    existing.filter(propertyOutOfOrder(sorted)).forEach(sortProperty(sorted));
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
        .sort((a, b) => trimName(a).localeCompare(trimName(b)))
        .map((property) => property.getStructure() as TPropertyStructure);

const shouldQuoteEscapeNewProperty = (
    name: string,
    existing: Property[]
): boolean => {
    // If the property name has spaces or dashes, it will need to be quote escaped to be valid TS.
    if (name.includes(" ") || name.includes("-")) {
        return true;
    }

    // If every property starts & ends with quotes, it must be an enforced style. Keep it consistent.
    return (
        existing.length > 0 &&
        existing.every((property) =>
            property.getName().match(/["']{1}[a-zA-Z0-9 _\-]+["']{1}/)
        )
    );
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const propertyOutOfOrder = <
    TProperty extends Property,
    TPropertyStructure extends PropertyStructure<TProperty>
>(
    sorted: TPropertyStructure[]
) => (existingProperty: TProperty, index: number) =>
    existingProperty.getName() !== sorted[index].name;

const sortProperty = <
    TProperty extends Property,
    TPropertyStructure = PropertyStructure<TProperty>
>(
    sorted: Array<TPropertyStructure>
) => (existingProperty: TProperty, index: number) =>
    existingProperty.set(sorted[index]);

const trimName = <T extends NamedNodeSpecificBase<Node>>(node: T) =>
    StringUtils.stripQuotes(node.getName());

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const NodeUtils = {
    findIndex,
    findIdentifier,
    findObjectLiteralExpressionWithProperty,
    findPropertyIndexByName,
    findPropertyByName,
    getPropertyAssignments,
    getNameOrText,
    isObjectLiteralExpressionWithProperty,
    mapToPropertyAssignments,
    shouldQuoteEscapeNewProperty,
    sortPropertiesByName,
    sortPropertyAssignments,
    sortPropertySignatures,
    updateProperties,
};

// #endregion Exports
