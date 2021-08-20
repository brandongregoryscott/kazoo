import { Property } from "../types/property";
import { StringUtils } from "./string-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const PropertyUtils = {
    comparePropertyByName: (a: Property) => (b: Property) =>
        StringUtils.stripQuotes(a.getName()) ===
        StringUtils.stripQuotes(b.getName()),

    getNames: (properties: Property[]): string[] =>
        properties.map((property) =>
            StringUtils.stripQuotes(property.getName())
        ),

    sortPropertiesByName: <TProperty extends Property = Property>(
        properties: Property[]
    ): TProperty[] =>
        properties.sort((a, b) =>
            StringUtils.stripQuotes(a.getName()).localeCompare(
                StringUtils.stripQuotes(b.getName())
            )
        ) as TProperty[],
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { PropertyUtils };

// #endregion Exports
