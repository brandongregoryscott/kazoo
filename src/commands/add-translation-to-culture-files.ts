import { ProjectUtils } from "../utilities/project-utils";
import {
    Identifier,
    Node,
    ObjectLiteralElementLike,
    OptionalKind,
    PropertyAssignmentStructure,
    SourceFile,
} from "ts-morph";
import { NodeUtils } from "../utilities/node-utils";
import { StringUtils } from "../utilities/string-utils";
import { ConfigUtils } from "../utilities/config-utils";
import { InsertionPosition } from "../enums/insertion-position";
import { WindowUtils } from "../utilities/window-utils";
import translate from "@vitalets/google-translate-api";
import { DEFAULT_LANGUAGE_CODE } from "../constants/language-code-map";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { CoreUtils } from "../utilities/core-utils";
import _ from "lodash";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addTranslationToCultureFiles = async (
    key?: string,
    translation?: string
): Promise<OptionalKind<PropertyAssignmentStructure>[]> => {
    try {
        const cultureInterface = await ProjectUtils.getCultureInterface();
        const cultureFiles = await ProjectUtils.getCultureFiles();

        if (key == null) {
            key = await WindowUtils.prompt(
                `Enter a key from ${cultureInterface.getName()} to insert into the culture files`
            );
        }

        if (key == null) {
            return [];
        }

        if (translation == null) {
            translation = await WindowUtils.prompt(
                `Enter the English copy for key '${key}'`
            );
        }

        if (translation == null) {
            return [];
        }

        const transformationPromises = cultureFiles.map((file) =>
            _addTranslationToFile(file, key!, translation!)
        );

        const transformations = await Promise.all(transformationPromises);

        WindowUtils.info(
            `Successfully updated ${transformations.length} culture files!`
        );

        return _.compact(transformations);
    } catch (error) {
        CoreUtils.catch("addTranslationToCultureFiles", error);
    }

    return [];
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _addTranslationToFile = async (
    file: SourceFile,
    key: string,
    value: string
): Promise<OptionalKind<PropertyAssignmentStructure> | undefined> => {
    const baseLanguage = SourceFileUtils.getBaseLanguage(file);
    const resourceObject = SourceFileUtils.getResourcesObject(file);
    if (resourceObject == null) {
        WindowUtils.errorResourcesNotFound(file);
        return;
    }

    const existingProperties = resourceObject.getProperties();

    const newProperty = await _buildNewProperty(
        key,
        value,
        existingProperties,
        baseLanguage
    );

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

    await file.save();

    return newProperty;
};

const _buildNewProperty = async (
    key: string,
    value: string,
    assignments: ObjectLiteralElementLike[],
    baseLanguage?: Identifier
): Promise<OptionalKind<PropertyAssignmentStructure>> => {
    const matchedLanguage = StringUtils.matchLanguageCode(
        baseLanguage?.getText()
    );

    const properties = assignments.filter(Node.isPropertyAssignment);
    const property: OptionalKind<PropertyAssignmentStructure> = {
        initializer: StringUtils.quoteEscape(value),
        name: StringUtils.quoteEscapeIfNeeded(key, properties),
    };

    if (matchedLanguage == null || matchedLanguage === DEFAULT_LANGUAGE_CODE) {
        return property;
    }

    try {
        const translationResult = await translate(value, {
            from: DEFAULT_LANGUAGE_CODE,
            to: matchedLanguage,
        });

        const translatedProperty = {
            ...property,
            initializer: StringUtils.quoteEscape(translationResult.text),
        };
        return translatedProperty;
    } catch (error) {
        WindowUtils.error(
            `Error encountered attempting to translate to '${matchedLanguage}', using English copy instead - ${error}`
        );
    }

    return property;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { addTranslationToCultureFiles };

// #endregion Exports
