import {
    Identifier,
    Node,
    ObjectLiteralExpression,
    SourceFile,
    SyntaxKind,
} from "ts-morph";
import { SharedConstants } from "../constants/shared-constants";
import { NodeUtils } from "./node-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const SourceFileUtils = {
    /**
     * Returns the base language object from a given source file. Assumes the `SourceFile` is in the
     * expected structure.
     *
     * @see https://github.com/brandongregoryscott/kazoo#requirements
     */
    getBaseLanguage(file: SourceFile): Identifier | undefined {
        const initializerArgs = _getInitializerArgs(file);

        const baseLanguage = NodeUtils.findIdentifier(initializerArgs);

        return baseLanguage;
    },

    /**
     * Returns the inner `resources` object from the call expression initializer. Assumes the
     * `SourceFile` is in the expected structure.
     *
     * @see https://github.com/brandongregoryscott/kazoo#requirements
     */
    getResourcesObject(file: SourceFile): ObjectLiteralExpression | undefined {
        const initializerArgs = _getInitializerArgs(file);
        const resourceInitializer = NodeUtils.findObjectLiteralExpressionWithProperty(
            initializerArgs,
            SharedConstants.RESOURCES
        );

        const resourceObject = resourceInitializer
            ?.getProperty(SharedConstants.RESOURCES)
            ?.getLastChildByKind(SyntaxKind.ObjectLiteralExpression);

        return resourceObject;
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _getInitializerArgs = (file: SourceFile): Node[] => {
    // Get the first variable exported - we should be able to assume that the exported value is the culture resource
    const cultureResource = file.getVariableDeclaration((variable) =>
        variable.isExported()
    );

    return (
        cultureResource
            ?.getInitializerIfKind(SyntaxKind.CallExpression)
            ?.getArguments() ?? []
    );
};
// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { SourceFileUtils };

// #endregion Exports
