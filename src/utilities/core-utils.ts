import { Commands } from "../constants/commands";
import { log } from "./log";
import { WindowUtils } from "./window-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const CoreUtils = {
    catch(functionName: keyof typeof Commands, error: any): undefined {
        log.error(`[${functionName}]:`, error);
        WindowUtils.error(
            "An error occurred running command, see log file for more detail."
        );

        return undefined;
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { CoreUtils };

// #endregion Exports
