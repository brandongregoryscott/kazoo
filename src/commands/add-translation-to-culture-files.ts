import { ProjectUtils } from "../utilities/project-utils";
import {
    Identifier,
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
import { Property } from "../types/property";
import { SourceFileUtils } from "../utilities/source-file-utils";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const addTranslationToCultureFiles = async (
    key?: string,
    translation?: string
) => {
    const cultureInterface = await ProjectUtils.getCultureInterface();
    const cultureFiles = await ProjectUtils.getCultureFiles();

    if (key == null) {
        key = await WindowUtils.prompt(
            `Enter a key from ${cultureInterface.getName()} to insert into the culture files`
        );
    }

    if (key == null) {
        return;
    }

    if (translation == null) {
        translation = await WindowUtils.prompt(
            `Enter the English copy for key '${key}'`
        );
    }

    if (translation == null) {
        return;
    }

    const transformations = cultureFiles.map((file) =>
        _addTranslationToFile(file, key!, translation!)
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
    const baseLanguage = SourceFileUtils.getBaseLanguage(file);
    const resourceObject = SourceFileUtils.getResourcesObject(file);
    if (resourceObject == null) {
        await WindowUtils.errorResourcesNotFound(file);
        return;
    }

    const existingProperties = NodeUtils.getPropertyAssignments(resourceObject);

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

    return file.save();
};

const _buildNewProperty = async (
    key: string,
    value: string,
    existingProperties: Property[],
    baseLanguage?: Identifier
): Promise<OptionalKind<PropertyAssignmentStructure>> => {
    const matchedLanguage = StringUtils.matchLanguageCode(
        baseLanguage?.getText()
    );

    const property: OptionalKind<PropertyAssignmentStructure> = {
        name: StringUtils.quoteEscapeIfNeeded(key, existingProperties),
        initializer: StringUtils.quoteEscape(value),
    };

    if (matchedLanguage == null || matchedLanguage === DEFAULT_LANGUAGE_CODE) {
        return property;
    }

    try {
        const translationResult = await translate(value, {
            from: DEFAULT_LANGUAGE_CODE,
            to: matchedLanguage,
        });

        return {
            name: StringUtils.quoteEscapeIfNeeded(key, existingProperties),
            initializer: StringUtils.quoteEscape(translationResult.text),
        };
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
