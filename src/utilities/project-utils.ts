import { Project, SourceFile } from "ts-morph";
import { ConfigUtils } from "./config-utils";
import * as vscode from "vscode";
import { ToastUtils } from "./toast-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const config = ConfigUtils.get();
const ERROR_CULTURE_INTERFACE_NOT_FOUND = `Error - culture interface could not be found matching path ${config.cultureInterfacePath}. Please check the path in your settings.`;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Variables
// -----------------------------------------------------------------------------------------

let _project: Project = new Project();

// #endregion Variables

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const get = (): Project => _project;

const getCultureInterface = async (): Promise<SourceFile> => {
    const path = await _getCultureInterfacePath();
    if (path == null) {
        throw new Error(ERROR_CULTURE_INTERFACE_NOT_FOUND);
    }

    return _project.getSourceFileOrThrow(path);
};

const initializeFromConfig = async (): Promise<Project> => {
    const cultureInterfacePath = await _getCultureInterfacePath();
    if (cultureInterfacePath != null) {
        _project.addSourceFileAtPath(cultureInterfacePath);
    }

    const cultureFilePaths = await _getCultureFilePaths();
    if (cultureFilePaths != null) {
        _project.addSourceFilesAtPaths(cultureFilePaths);
    }

    return _project;
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const _getCultureFilePaths = async (): Promise<string[] | undefined> => {
    let resolvedPaths: string[] | undefined;
    config.cultureFilePaths.forEach(async (path: string) => {
        const uris = await vscode.workspace.findFiles(
            path,
            "**/node_modules/**"
        );

        if (uris.length <= 0) {
            return;
        }

        const fsPaths = uris.map((uri) => uri.fsPath);
        if (resolvedPaths == null) {
            resolvedPaths = fsPaths;
            return;
        }

        resolvedPaths = [...resolvedPaths, ...fsPaths];
    });

    // BSCOTT - is this the right place to be handling errors?
    if (resolvedPaths == null) {
        ToastUtils.error(
            `Error - no culture files could be found matching patterns ${JSON.stringify(
                config.cultureFilePaths
            )}. Please check the paths in your settings.`
        );

        return undefined;
    }

    return resolvedPaths;
};

const _getCultureInterfacePath = async (): Promise<string | undefined> => {
    const uri = await (
        await vscode.workspace.findFiles(
            config.cultureInterfacePath,
            "**/node_modules/**",
            1
        )
    )[0];

    // BSCOTT - is this the right place to be handling errors?
    if (uri == null) {
        ToastUtils.error(ERROR_CULTURE_INTERFACE_NOT_FOUND);

        return undefined;
    }

    return uri.fsPath;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const ProjectUtils = {
    get,
    getCultureInterface,
    initializeFromConfig,
};

// #endregion Exports
