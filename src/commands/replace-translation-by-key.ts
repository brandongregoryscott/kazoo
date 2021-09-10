import { WindowUtils } from "../utilities/window-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { NodeUtils } from "../utilities/node-utils";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { Commands } from "../constants/commands";
import { PropertyUtils } from "../utilities/property-utils";
import {
    ObjectLiteralExpression,
    PropertyAssignment,
    SyntaxKind,
} from "ts-morph";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { StringUtils } from "../utilities/string-utils";
import { ConfigUtils } from "../utilities/config-utils";
import _ from "lodash";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const replaceTranslationByKey = async (
    key?: string,
    cultureFilePath?: string
) => {
    try {
        const cultureInterface = await ProjectUtils.getCultureInterface();
        const interfaceProperties = cultureInterface.getProperties();
        const cultureFiles = await ProjectUtils.getCultureFiles();
        const cultureFileProperties = _.chain(cultureFiles)
            .flatMap(SourceFileUtils.getObjectLiteralsWithStringAssignments)
            .map(NodeUtils.getPropertyAssignments)
            .flatMap()
            .value();
        const propertyNames = _.uniq(
            PropertyUtils.getNames([
                ...interfaceProperties,
                ...cultureFileProperties,
            ])
        ).sort();

        if (key == null) {
            key = await WindowUtils.selection(
                propertyNames,
                "Select a key to update copy for"
            );
        }

        if (key == null) {
            log.debug(
                `Key was not entered from prompt in ${Commands.replaceTranslationByKey}`
            );
            return;
        }

        const cultureFilePaths = cultureFiles.map((file) => file.getFilePath());

        if (cultureFilePath == null) {
            cultureFilePath = await WindowUtils.selection(cultureFilePaths);
        }

        if (cultureFilePath == null) {
            log.debug("No cultureFilePath entered - not continuing.");
            return;
        }

        const cultureFile = SourceFileUtils.findByFilePath(
            cultureFiles,
            cultureFilePath
        );

        if (cultureFile == null) {
            log.warn(
                "cultureFile was unexpectedly null",
                cultureFilePath,
                cultureFile
            );
            return;
        }

        const resources = SourceFileUtils.getResourcesObject(cultureFile);
        if (resources == null) {
            WindowUtils.errorResourcesNotFound(cultureFile);
            return;
        }
        const objectLiteralWithProperty = NodeUtils.findObjectLiteralExpressionWithProperty(
            cultureFile.getDescendants(),
            key
        );

        const objectLiterals = SourceFileUtils.getObjectLiteralsWithStringAssignments(
            cultureFile
        );

        const propertyAssignments = NodeUtils.getPropertyAssignments(
            objectLiteralWithProperty ?? resources
        );

        const property = NodeUtils.findPropertyByName<PropertyAssignment>(
            key,
            propertyAssignments
        );

        if (property == null) {
            log.warn(
                "Could not find translation for key",
                key,
                cultureFilePath
            );
            WindowUtils.warning(
                `Could not find translation for key '${key}' in ${cultureFile.getBaseName()}`
            );
            return;
        }

        const originalCopy = property.getInitializer()?.getText();
        if (originalCopy == null) {
            log.warn("Original copy was unexpectedly null", property);
            return;
        }

        const updatedCopy = await WindowUtils.prefilledPrompt(
            `Enter updated copy for '${key}'`,
            StringUtils.stripQuotes(originalCopy)
        );

        if (updatedCopy == null) {
            log.debug("Updated copy was not entered - not continuing.");
            return;
        }

        property.setInitializer(StringUtils.quoteEscape(updatedCopy));

        await movePropertyIfRequested(objectLiterals, property);

        await cultureFile.save();

        WindowUtils.info(
            `Successfully updated '${key}' in ${cultureFile.getBaseName()}!`
        );
    } catch (error) {
        CoreUtils.catch("replaceTranslationByKey", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

/**
 * Formats an object literal's 'parent' node at the assignment delimiter, ie
 *
 * @example
 * const ProfessionallyTranslatedSpanishSpain = { // <-- Displays 'ProfessionallyTranslatedSpanishSpain'
 *  ...
 * }
 * // or...
 * resources: { // <-- Displays 'resources'
 *  ...
 * }
 */
const formatObjectLiteralName = (
    objectLiteral: ObjectLiteralExpression
): string => {
    const parentText = objectLiteral.getParent().getText();

    const delimiters = ["=", ": {"];
    const matchingDelimeter = delimiters.find((delimiter) =>
        parentText.includes(delimiter)
    );
    if (matchingDelimeter != null) {
        return parentText.split(matchingDelimeter)[0].trim();
    }

    return parentText;
};

const movePropertyIfRequested = async (
    objectLiterals: ObjectLiteralExpression[],
    property: PropertyAssignment
) => {
    const key = StringUtils.stripQuotes(property.getName());

    if (objectLiterals.length <= 1) {
        return;
    }

    const parent = property.getParentIfKind(SyntaxKind.ObjectLiteralExpression);

    if (parent == null) {
        log.warn(
            "Parent was unexpectedly null when attempting to prompt user for a move",
            objectLiterals,
            property
        );
        return;
    }

    const objectLiteralOptions = objectLiterals.filter(
        (objectLiteral) => objectLiteral !== parent
    );
    const options = [
        ...objectLiteralOptions.map(objectLiteralToSelectOption(key)),
        `No, keep '${key}' where it is`,
    ];
    const answer = await WindowUtils.selection(
        options,
        "Move this copy to another object?"
    );

    if (answer == null || !answer.includes("Yes")) {
        return;
    }

    const indexOfObjectLiteral = options.indexOf(answer);
    if (indexOfObjectLiteral < 0) {
        log.warn(
            "Unable to match up answer with available options",
            options,
            answer
        );
        return;
    }

    const selectedObjectLiteral = objectLiteralOptions[indexOfObjectLiteral];

    // Clone the property, remove it from the original object, and insert it into the selected object
    const propertyStructure = property.getStructure();
    property.remove();

    const { insertionPosition } = ConfigUtils.get();

    const index = NodeUtils.findIndex(
        insertionPosition,
        key,
        selectedObjectLiteral.getProperties()
    );
    selectedObjectLiteral.insertPropertyAssignment(index, propertyStructure);
};

const objectLiteralToSelectOption = (key: string) => (
    objectLiteral: ObjectLiteralExpression
) =>
    `Yes, move '${key}' to '${formatObjectLiteralName(
        objectLiteral
    )}' (Line ${objectLiteral.getStartLineNumber()})`;

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { replaceTranslationByKey };

// #endregion Exports
