import anylogger from "anylogger";
import log4js from "log4js";
import { WorkspaceUtils } from "./workspace-utils";

const logger = log4js.getLogger();
log4js.configure({
    appenders: {
        kazoo: {
            type: "file",
            filename: `${WorkspaceUtils.getFolder()}/kazoo_log.txt`,
        },
    },
    categories: { default: { appenders: ["kazoo"], level: "error" } },
});
logger.level = "debug";

const log = anylogger("kazoo");

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { log };

// #endregion Exports
