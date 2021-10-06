import _ from "lodash";
import { Property } from "../types/property";
import { StringUtils } from "./string-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const PropertyUtils = {
    compareByName: (a: Property | string, b: Property | string) => {
        return stripQuotes(a) === stripQuotes(b);
    },

    getNames: (properties: Property[]): string[] => properties.map(stripQuotes),

    sortByName: <TProperty extends Property = Property>(
        properties: Property[]
    ): TProperty[] =>
        properties.sort((a, b) =>
            stripQuotes(a).localeCompare(stripQuotes(b))
        ) as TProperty[],
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const stripQuotes = (property: Property | string) =>
    StringUtils.stripQuotes(
        _.isString(property) ? property : property.getName()
    );

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { PropertyUtils };

// #endregion Exports
