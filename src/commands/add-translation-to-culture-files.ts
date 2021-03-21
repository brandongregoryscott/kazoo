import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";
import {
    OptionalKind,
    PropertyAssignmentStructure,
    SourceFile,
} from "ts-morph";
import { NodeUtils } from "../utilities/node-utils";
import { StringUtils } from "../utilities/string-utils";
import { ConfigUtils } from "../utilities/config-utils";
import { InsertionPosition } from "../enums/insertion-position";
import { WindowUtils } from "../utilities/window-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const RESOURCES = "resources";

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addTranslationToCultureFiles = async (key?: string) => {
    const cultureInterface = await ProjectUtils.getCultureInterface();
    const cultureFiles = await ProjectUtils.getCultureFiles();

    if (key == null) {
        key = await vscode.window.showInputBox({
            prompt: `Enter a key from ${cultureInterface.getName()} to insert into the culture files`,
        });
    }

    if (key == null) {
        return;
    }

    const translation = await vscode.window.showInputBox({
        prompt: `Enter the English copy for key '${key}'`,
    });

    if (translation == null) {
        return;
    }

    const transformations = cultureFiles.map((file) =>
        _addTranslationToFile(file, key!, translation)
    );

    await Promise.all(transformations);
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _addTranslationToFile = async (
    file: SourceFile,
    key: string,
    value: string
) => {
    // Get the first variable exported - we should be able to assume that the exported value is the culture resource
    const cultureResource = file.getVariableDeclaration((variable) =>
        variable.isExported()
    );

    // If further comparison is needed, underlying type name can be compared like so:
    // variable.getType().getSymbol().getEscapedName() === "Culture"

    // The current way we're structuring the exported variable is with an initialization like...
    // const EnglishUnitedStates = LocalizationUtils.cultureFactory(BaseEnglishUnitedStates, {
    //     resources: {
    //         "example": "This is an example",
    //         ...
    //     }
    // })
    const initializer = cultureResource?.getInitializerIfKind(
        SyntaxKind.CallExpression
    );

    const args = initializer?.getArguments() ?? [];
    const baseLanguage = initializer?.getChildrenOfKind(
        SyntaxKind.Identifier
    )[0];
    const resourceInitializer = NodeUtils.findObjectLiteralExpressionWithProperty(
        args,
        RESOURCES
    );

    if (resourceInitializer == null) {
        WindowUtils.error(
            `Expected to find object literal with key '${RESOURCES}' in ${file.getBaseName()}.`
        );
        return;
    }

    const resourceObject = resourceInitializer
        .getPropertyOrThrow(RESOURCES)
        .getLastChildIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

    const existingProperties = NodeUtils.getPropertyAssignments(resourceObject);

    const newProperty: OptionalKind<PropertyAssignmentStructure> = {
        name: StringUtils.quoteEscapeIfNeeded(key, existingProperties),
        initializer: StringUtils.quoteEscape(value),
    };

    const { insertionPosition } = ConfigUtils.get();

    const index = NodeUtils.findIndex(
        insertionPosition,
        key,
        existingProperties
    );
    resourceObject.insertPropertyAssignment(index, newProperty);

    // Only do a full sort/replace if strictly alphabetizing
    if (insertionPosition === InsertionPosition.StrictAlphabetical) {
        NodeUtils.sortPropertyAssignments(resourceObject);
    }

    return file.save();
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addTranslationToCultureFiles };

// #endregion Exports
