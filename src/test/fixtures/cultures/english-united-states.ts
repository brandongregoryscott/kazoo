import {
    BaseEnglishUnitedStates,
    Culture,
    LocalizationUtils,
} from "andculturecode-javascript-core";
import { CultureResources } from "../interfaces/culture-resources";

const EnglishUnitedStates: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseEnglishUnitedStates,
    {
        resources: {},
    }
);

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { EnglishUnitedStates };

// #endregion Exports
