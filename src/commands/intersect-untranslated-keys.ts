import _ from "lodash";
import { Commands } from "../constants/commands";
import { Language } from "../enums/language";
import { CoreUtils } from "../utilities/core-utils";
import { log } from "../utilities/log";
import { NodeUtils } from "../utilities/node-utils";
import { ProjectUtils } from "../utilities/project-utils";
import { PropertyUtils } from "../utilities/property-utils";
import { SourceFileUtils } from "../utilities/source-file-utils";
import { StringUtils } from "../utilities/string-utils";
import { WindowUtils } from "../utilities/window-utils";
import * as vscode from "vscode";
import { PropertyAssignment } from "ts-morph";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const intersectUntranslatedKeys = async (cultureFilePath?: string) => {
    try {
        const cultureFiles = await ProjectUtils.getCultureFiles();
        const cultureFilePaths = SourceFileUtils.filterByNonEnglish(
            cultureFiles
        ).map((file) => file.getFilePath());
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

        if (cultureFilePath == null) {
            cultureFilePath = await WindowUtils.selection(
                cultureFilePaths,
                "Select a culture file to intersect"
            );
        }

        if (cultureFilePath == null) {
            log.debug(
                `cultureFilePath was not entered from prompt in ${Commands.intersectUntranslatedKeys}`
            );
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

        const untranslatedKeys = PropertyUtils.getNames(
            NodeUtils.getPropertyAssignments(resources)
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
        ).filter((property) =>
            untranslatedKeys.includes(
                StringUtils.stripQuotes(property.getName())
            )
        );

        const document = await vscode.workspace.openTextDocument({
            content: appendHeader(mapPropertiesToCsv(englishProperties)),
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
        .map((property) =>
            [property.getName(), property.getInitializer()?.getText()].join()
        )
        .join("\n");

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { intersectUntranslatedKeys };

// #endregion Exports
