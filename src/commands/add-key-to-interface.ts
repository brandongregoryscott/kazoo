import { ConfigUtils } from "../utilities/config-utils";
import { ToastUtils } from "../utilities/toast-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";
import { PropertySignature } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyToInterface = async () => {
    const cultureInterfaceFile = await ProjectUtils.getCultureInterface();

    // Refreshing from file system incase extension has previously modified file
    await cultureInterfaceFile.refreshFromFileSystem();

    const cultureInterface = cultureInterfaceFile.getChildrenOfKind(
        SyntaxKind.InterfaceDeclaration
    )[0];

    const key = await vscode.window.showInputBox({
        prompt: `Enter a key to insert into ${cultureInterface.getName()}`,
    });

    if (key == null) {
        return;
    }

    const properties = cultureInterface.getProperties();
    const existingProperty = findExistingProperty(key, properties);
    if (existingProperty != null) {
        ToastUtils.error(
            `Error - key '${key}' already exists in ${cultureInterface.getName()}:L${existingProperty.getStartLineNumber()}`
        );
        return;
    }

    const index = findAlphabeticalIndex(key, properties);
    const newProperty = cultureInterface.insertProperty(index, {
        name: quoteEscapeKey(key),
        type: "string",
    });

    await cultureInterfaceFile.save();

    ToastUtils.info(
        `Key '${key}' successfully added to ${cultureInterface.getName()}:L${newProperty.getStartLineNumber()}`
    );
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const findAlphabeticalIndex = (
    key: string,
    properties: PropertySignature[]
): number => {
    const propertyNames = stripPropertyNamesOfQuotes(properties);

    propertyNames.push(key);

    return propertyNames
        .sort()
        .findIndex((propertyName) => propertyName === key);
};

const findExistingProperty = (
    key: string,
    properties: PropertySignature[]
): PropertySignature | undefined => {
    const index = stripPropertyNamesOfQuotes(properties).findIndex(
        (propertyName) => propertyName === key
    );

    return properties[index];
};

const stripPropertyNamesOfQuotes = (
    properties: PropertySignature[]
): string[] =>
    properties.map((property) =>
        // Strip out any quotes that may be surrounding the actual property name
        property.getName().replace(/['"]/g, "")
    );

// BSCOTT - This might need to be a configuration setting
const quoteEscapeKey = (key: string) => {
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
