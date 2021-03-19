import { ConfigUtils } from "../utilities/config-utils";
import { WindowUtils } from "../utilities/window-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";
import { PropertySignature } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyToInterface = async () => {
    const cultureInterfaceFile = await ProjectUtils.getCultureInterfaceFile();
    const cultureInterface = await ProjectUtils.getCultureInterface();

    const key = await vscode.window.showInputBox({
        prompt: `Enter a key to insert into ${cultureInterface.getName()}`,
    });

    if (key == null) {
        return;
    }

    const properties = cultureInterface.getProperties();
    const existingProperty = _findExistingProperty(key, properties);
    if (existingProperty != null) {
        WindowUtils.error(
            `Error - key '${key}' already exists in ${cultureInterface.getName()}:L${existingProperty.getStartLineNumber()}`
        );
        return;
    }

    const index = _findAlphabeticalIndex(key, properties);
    const newProperty = cultureInterface.insertProperty(index, {
        name: _quoteEscapeKey(key),
        type: "string",
    });

    await cultureInterfaceFile.save();

    WindowUtils.info(
        `Key '${key}' successfully added to ${cultureInterface.getName()}:L${newProperty.getStartLineNumber()}`
    );
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _findAlphabeticalIndex = (
    key: string,
    properties: PropertySignature[]
): number => {
    const propertyNames = _stripPropertyNamesOfQuotes(properties);

    propertyNames.push(key);

    return propertyNames
        .sort()
        .findIndex((propertyName) => propertyName === key);
};

const _findExistingProperty = (
    key: string,
    properties: PropertySignature[]
): PropertySignature | undefined => {
    const index = _stripPropertyNamesOfQuotes(properties).findIndex(
        (propertyName) => propertyName === key
    );

    return properties[index];
};

const _stripPropertyNamesOfQuotes = (
    properties: PropertySignature[]
): string[] =>
    properties.map((property) =>
        // Strip out any quotes that may be surrounding the actual property name
        property.getName().replace(/['"]/g, "")
    );

// BSCOTT - This might need to be a configuration setting
const _quoteEscapeKey = (key: string) => {
    if (!key.startsWith(`"`)) {
        key = `"${key}`;
    }

    if (!key.endsWith(`"`)) {
        key = `${key}"`;
    }

    return key;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addKeyToInterface };

// #endregion Exports
