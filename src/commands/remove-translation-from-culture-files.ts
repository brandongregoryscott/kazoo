import { WindowUtils } from "../utilities/window-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { NodeUtils } from "../utilities/node-utils";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { Commands } from "../constants/commands";
import { PropertyUtils } from "../utilities/property-utils";
import { SourceFileUtils } from "../utilities/source-file-utils";
import _ from "lodash";
import { SourceFile } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const removeTranslationFromCultureFiles = async (key?: string) => {
    try {
        const cultureFiles = await ProjectUtils.getCultureFiles();
        const resources = _.compact(
            cultureFiles.map(SourceFileUtils.getResourcesObject)
        );
        const properties = _.chain(resources)
            .flatMap(NodeUtils.getPropertyAssignments)
            .uniqBy(NodeUtils.getNameOrText)
            .value();

        const propertyNames = PropertyUtils.getNames(properties).sort();
        if (key == null) {
            key = await WindowUtils.selection(propertyNames);
        }

        if (key == null) {
            log.debug(
                `Key was not entered from prompt in ${Commands.removeTranslationFromCultureFiles}`
            );
            return;
        }

        const removeProperty = _removeProperty(key);
        const transformations = await Promise.all(
            cultureFiles.map(removeProperty)
        );

        WindowUtils.info(
            `Successfully updated ${
                _.compact(transformations).length
            } culture files!`
        );
    } catch (error) {
        CoreUtils.catch("removeTranslationFromCultureFiles", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _removeProperty = (key: string) => async (sourceFile: SourceFile) => {
    const resources = await SourceFileUtils.getResourcesObject(sourceFile);

    if (resources == null) {
        return;
    }

    const properties = NodeUtils.getPropertyAssignments(resources);
    const property = NodeUtils.findPropertyByName(key, properties);

    if (property == null) {
        WindowUtils.info(
            `${sourceFile.getBaseName()} does not contain entry for '${key}'`
        );
        return;
    }

    property.remove();
    await sourceFile.save();

    return key;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { removeTranslationFromCultureFiles };

// #endregion Exports
