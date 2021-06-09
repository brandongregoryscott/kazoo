import anylogger from "anylogger";
import log4js, {
    Appender,
    ConsoleAppender,
    FileAppender,
    LogLevelFilterAppender,
} from "log4js";
import { WorkspaceUtils } from "./workspace-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const consoleAppender: ConsoleAppender = {
    type: "console",
};

const fileAppender: FileAppender = {
    filename: `${WorkspaceUtils.getFolder()}/kazoo_log.txt`,
    type: "file",
};

const fileLogLevelFilterAppender: LogLevelFilterAppender = {
    appender: "file",
    level: "error",
    type: "logLevelFilter",
};

const appenders: Record<string, Appender> = {
    console: consoleAppender,
    file: fileAppender,
    fileLogLevelFilter: fileLogLevelFilterAppender,
};

log4js.configure({
    appenders,
    categories: {
        default: {
            appenders: ["console", "fileLogLevelFilter"],
            level: "trace",
        },
    },
});

const log = anylogger("kazoo");

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { log };

// #endregion Exports
