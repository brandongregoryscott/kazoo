import {
    Identifier,
    Node,
    ObjectLiteralExpression,
    SourceFile,
    SyntaxKind,
} from "ts-morph";
import { SharedConstants } from "../constants/shared-constants";
import { LanguageCode } from "../enums/language-code";
import { NodeUtils } from "./node-utils";
import { StringUtils } from "./string-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const SourceFileUtils = {
    filterByNonEnglish(files: Array<SourceFile>): Array<SourceFile> {
        return files.filter((file) => {
            const languageCode = SourceFileUtils.getLanguageCode(file);

            if (languageCode == null || languageCode === LanguageCode.Default) {
                return false;
            }

            return true;
        });
    },

    findByFilePath(
        files: Array<SourceFile>,
        filePath: string
    ): SourceFile | undefined {
        return files.find((file) => file.getFilePath() === filePath);
    },

    getLanguageCode(file: SourceFile): string | undefined {
        return StringUtils.matchLanguageCode(
            SourceFileUtils.getLanguageIdentifier(file)?.getText()
        );
    },

    /**
     * Returns the base language object from a given source file. Assumes the `SourceFile` is in the
     * expected structure.
     *
     * @see https://github.com/brandongregoryscott/kazoo#requirements
     */
    getLanguageIdentifier(file: SourceFile): Identifier | undefined {
        const initializerArgs = _getInitializerArgs(file);
        return NodeUtils.findIdentifier(initializerArgs);
    },

    /**
     * Returns all of the object literals in a file with all-string property assignments
     */
    getObjectLiteralsWithStringAssignments(
        file: SourceFile
    ): ObjectLiteralExpression[] {
        return NodeUtils.findObjectLiteralExpressionWithStringAssignments(
            file.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression)
        );
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
