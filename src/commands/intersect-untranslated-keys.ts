import _ from "lodash";
import { Commands } from "../constants/commands";
import { Language } from "../enums/language";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { NodeUtils } from "../utilities/node-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { WindowUtils } from "../utilities/window-utils";
import * as vscode from "vscode";
import { PropertyAssignment, SourceFile } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const intersectUntranslatedKeys = async () => {
    try {
        const cultureFiles = await ProjectUtils.getCultureFiles();
        const cultureFileOptions = SourceFileUtils.toSelectOptions(
            SourceFileUtils.filterByNonEnglish(cultureFiles)
        );

        const englishCultureFile = await ProjectUtils.getCultureFileByLanguage(
            Language.English
        );
        if (englishCultureFile == null) {
            log.warn(
                "Could not find English culture file",
                cultureFiles,
                englishCultureFile
            );
            return;
        }

        const cultureFile = (
            await WindowUtils.selectionWithValue(
                cultureFileOptions,
                "Select a culture file to intersect"
            )
        )?.value;

        if (cultureFile == null) {
            log.debug(
                `cultureFile was not entered from prompt in ${Commands.intersectUntranslatedKeys}`
            );
            return;
        }

        const resources = SourceFileUtils.getResourcesObject(cultureFile);
        if (resources == null) {
            WindowUtils.errorResourcesNotFound(cultureFile);
            return;
        }

        const untranslatedProperties = NodeUtils.getPropertyAssignments(
            resources
        );

        const englishResources = SourceFileUtils.getResourcesObject(
            englishCultureFile
        );
        if (englishResources == null) {
            WindowUtils.errorResourcesNotFound(englishCultureFile);
            return;
        }

        const englishProperties = NodeUtils.getPropertyAssignments(
            englishResources
        );

        const englishIntersection = _.intersectionBy(
            englishProperties,
            untranslatedProperties,
            (property) => property.getName()
        );

        const document = await vscode.workspace.openTextDocument({
            content: appendHeader(mapPropertiesToCsv(englishIntersection)),
        });
        await vscode.window.showTextDocument(document);
    } catch (error) {
        CoreUtils.catch("intersectUntranslatedKeys", error);
    }
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const appendHeader = (value: string): string =>
    `"Key","English Copy"\n${value}`;

const mapPropertiesToCsv = (properties: Array<PropertyAssignment>): string =>
    properties
        .map(
            (property) =>
                `${property.getName()},${property.getInitializer()?.getText()}`
        )
        .join("\n");

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { intersectUntranslatedKeys };

// #endregion Exports
