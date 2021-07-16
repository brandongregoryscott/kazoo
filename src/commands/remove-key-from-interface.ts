import { WindowUtils } from "../utilities/window-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { InterfaceDeclaration } from "ts-morph";
import { NodeUtils } from "../utilities/node-utils";
import { ConfigUtils } from "../utilities/config-utils";
import { StringUtils } from "../utilities/string-utils";
import { Property } from "../types/property";
import { InsertionPosition } from "../enums/insertion-position";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { Commands } from "../constants/commands";
import { PropertyUtils } from "../utilities/property-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const removeKeyFromInterface = async (key?: string) => {
    try {
        const cultureInterfaceFile = await ProjectUtils.getCultureInterfaceFile();
        const cultureInterface = await ProjectUtils.getCultureInterface();
        const interfaceName = cultureInterface.getName();
        const properties = cultureInterface.getProperties();
        const propertyNames = PropertyUtils.getNames(properties);
        if (key == null) {
            key = await WindowUtils.selection(propertyNames);
        }

        if (key == null) {
            log.debug(
                `Key was not entered from prompt in ${Commands.removeKeyFromInterface}`
            );
            return;
        }

        const existingProperty = NodeUtils.findPropertyByName(key, properties);
        if (existingProperty == null) {
            WindowUtils.info(
                `Key '${key}' does not exist in ${interfaceName}.`
            );
            return;
        }

        const lineNumber = existingProperty.getStartLineNumber();
        existingProperty.remove();

        await cultureInterfaceFile.save();

        WindowUtils.info(
            `Key '${key}' successfully removed from ${interfaceName}:L${lineNumber}`
        );
    } catch (error) {
        CoreUtils.catch("removeKeyFromInterface", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { removeKeyFromInterface };

// #endregion Exports
