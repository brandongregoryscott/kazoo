import {
    BaseEnglishUnitedStates,
    Culture,
    LocalizationUtils,
    // @ts-ignore
} from "andculturecode-javascript-core";
import { CultureResources } from "../interfaces/culture-resources";

const EnglishUnitedStates: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseEnglishUnitedStates,
    {
        resources: {
            accountInformation: "Account Information",
            cancelMySubscription: "Cancel My Subscription",
            checkOutFaq: "Check out our FAQs",
            subscriptionDetails: "Subscription Details",
            teamManagement: "Team Management"
        },
    }
);

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { EnglishUnitedStates };

// #endregion Exports
