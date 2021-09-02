import { CoreUtils } from "../utilities/core-utils";
import { WindowUtils } from "../utilities/window-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const intersectUntranslatedKeys = async () => {
    try {
        WindowUtils.info("intersectUntranslatedKeys");
    } catch (error) {
        CoreUtils.catch("intersectUntranslatedKeys", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { intersectUntranslatedKeys };

// #endregion Exports
