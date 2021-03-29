import { WindowUtils } from "../utilities/window-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { InterfaceDeclaration } from "ts-morph";
import { NodeUtils } from "../utilities/node-utils";
import { ConfigUtils } from "../utilities/config-utils";
import { StringUtils } from "../utilities/string-utils";
import { Property } from "../types/property";
import { InsertionPosition } from "../enums/insertion-position";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addKeyToInterface = async (key?: string) => {
    const cultureInterfaceFile = await ProjectUtils.getCultureInterfaceFile();
    const cultureInterface = await ProjectUtils.getCultureInterface();

    if (key == null) {
        key = await vscode.window.showInputBox({
            prompt: `Enter a key to insert into ${cultureInterface.getName()}`,
        });
    }

    if (key == null) {
        return;
    }

    const properties = cultureInterface.getProperties();
    const existingProperty = NodeUtils.findPropertyByName(key, properties);
    if (existingProperty != null) {
        WindowUtils.error(
            `Error - key '${key}' already exists in ${_fileAndLineNumber(
                cultureInterface,
                existingProperty
            )}`
        );
        return;
    }

    const { insertionPosition } = ConfigUtils.get();
    const index = NodeUtils.findIndex(insertionPosition, key, properties);

    let newProperty: Property = cultureInterface.insertProperty(index, {
        name: StringUtils.quoteEscapeIfNeeded(key, properties),
        type: "string",
    });

    // Only do a full sort/replace if strictly alphabetizing
    if (insertionPosition === InsertionPosition.StrictAlphabetical) {
        NodeUtils.sortPropertySignatures(cultureInterface);
    }

    await cultureInterfaceFile.save();

    // Refresh property as original might have been removed if strictly alphabetizing
    newProperty = NodeUtils.findPropertyByName(
        key,
        cultureInterface.getProperties()
    )!;

    WindowUtils.info(
        `Key '${key}' successfully added to ${_fileAndLineNumber(
            cultureInterface,
            newProperty
        )}`
    );

    return key;
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _fileAndLineNumber = (
    cultureInterface: InterfaceDeclaration,
    property: Property
): string => `${cultureInterface.getName()}:L${property.getStartLineNumber()}`;

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addKeyToInterface };

// #endregion Exports
