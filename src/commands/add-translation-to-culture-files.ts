import { ConfigUtils } from "../utilities/config-utils";
import { WindowUtils } from "../utilities/window-utils";
import * as vscode from "vscode";
import { ProjectUtils } from "../utilities/project-utils";
import { SyntaxKind } from "@ts-morph/common";
import {
    Node,
    ObjectLiteralExpression,
    OptionalKind,
    printNode,
    PropertyAssignment,
    PropertyAssignmentStructure,
    PropertySignature,
    StructureKind,
} from "ts-morph";
import { NodeUtils } from "../utilities/node-utils";
import { StringUtils } from "../utilities/string-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addTranslationToCultureFiles = async (key?: string) => {
    const cultureInterface = await ProjectUtils.getCultureInterface();
    const cultureFiles = await ProjectUtils.getCultureFiles();

    if (key == null || key.length <= 0) {
        key = await vscode.window.showInputBox({
            prompt: `Enter a key from ${cultureInterface.getName()} to insert into the culture files`,
        });
    }

    if (key == null) {
        return;
    }

    const englishCopy = await vscode.window.showInputBox({
        prompt: `Enter the English copy for key '${key}'`,
    });

    if (englishCopy == null) {
        return;
    }

    cultureFiles.forEach((file) => {
        // Get the first variable exported - we should be able to assume that the exported value is the culture resource
        const cultureResource = file.getVariableDeclaration((variable) =>
            variable.isExported()
        );

        // If further comparison is needed, underlying type name can be compared like so:
        // variable.getType().getSymbol().getEscapedName() === "Culture"

        const initializer = cultureResource?.getInitializerIfKind(
            SyntaxKind.CallExpression
        );

        const args = initializer?.getArguments() ?? [];
        const resourceInitializer = NodeUtils.findObjectLiteralExpressionWithProperty(
            args,
            "resources"
        );

        if (resourceInitializer == null) {
            return;
        }

        const resourceObject = resourceInitializer
            .getPropertyOrThrow("resources")
            .getLastChildIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

        const existingProperties = NodeUtils.getPropertyAssignments(
            resourceObject
        );

        const propertyName = NodeUtils.shouldQuoteEscapeNewProperty(
            key!,
            existingProperties
        )
            ? StringUtils.quoteEscape(key!)
            : StringUtils.stripQuotes(key!);

        const newProperty: OptionalKind<PropertyAssignmentStructure> = {
            name: propertyName,
            initializer: StringUtils.quoteEscape(englishCopy),
        };

        resourceObject.addPropertyAssignment(newProperty);

        const properties = NodeUtils.getPropertyAssignments(resourceObject);

        console.log(
            "properties:",
            properties.map((e) => e.getName())
        );

        const updatedProperties = NodeUtils.alphabetizeProperties(properties);

        // Remove old property assignments and add alphabetized version
        resourceObject.getProperties().map((property) => property.remove());
        resourceObject.addPropertyAssignments(updatedProperties);
        file.saveSync();

        // const objectLiteral = args
        //     .map((arg) =>
        //         arg.getLastChildByKind(SyntaxKind.ObjectLiteralExpression)
        //     )
        //     .filter((child) => Node.isObjectLiteralExpression(child))[0];
        // console.log("doesNotExist:", doesNotExist?.getFullText());
        // console.log("resources:", resources?.getFullText());
        // console.log("objectLiteral:", objectLiteral);
    });
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addTranslationToCultureFiles };

// #endregion Exports
