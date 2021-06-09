import { log } from "./log";
import { WindowUtils } from "./window-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const CoreUtils = {
    async catch(fn: Function, error: any): Promise<undefined> {
        log.error(`[${fn.name}]:`, error);
        await WindowUtils.error(
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
