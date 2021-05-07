import {
    BaseSpanishSpain,
    Culture,
    LocalizationUtils,
    // @ts-ignore
} from "andculturecode-javascript-core";
import { CultureResources } from "../interfaces/culture-resources";

const SpanishSpain: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseSpanishSpain,
    {
        resources: {},
    }
);

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { SpanishSpain };

// #endregion Exports
