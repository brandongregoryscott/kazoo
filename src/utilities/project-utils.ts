import { InterfaceDeclaration, Project, SourceFile } from "ts-morph";
import { ConfigUtils } from "./config-utils";
import { WindowUtils } from "./window-utils";
import { FileUtils } from "./file-utils";

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const config = ConfigUtils.get();
const ERROR_CULTURE_FILES_NOT_FOUND = `Error - no culture files could be found matching patterns ${JSON.stringify(
    config.cultureFilePaths
)}. Please check the paths in your settings.`;
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

const getCultureFiles = async (): Promise<SourceFile[]> => {
    const paths = await _getCultureFilePaths();
    if (paths == null) {
        throw new Error(ERROR_CULTURE_FILES_NOT_FOUND);
    }

    const files = _project.getSourceFiles(paths);
    await Promise.all(files.map((file) => file.refreshFromFileSystem()));
    return files;
};

const getCultureInterface = async (): Promise<InterfaceDeclaration> =>
    await (await getCultureInterfaceFile()).getInterfaces()[0];

const getCultureInterfaceFile = async (): Promise<SourceFile> => {
    const path = await _getCultureInterfacePath();
    if (path == null) {
        throw new Error(ERROR_CULTURE_INTERFACE_NOT_FOUND);
    }

    const file = _project.getSourceFileOrThrow(path);
    await file.refreshFromFileSystem();
    return file;
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
    const resolvedPaths = await FileUtils.findAll(config.cultureFilePaths);

    // BSCOTT - is this the right place to be handling errors?
    if (resolvedPaths.length <= 0) {
        WindowUtils.error(ERROR_CULTURE_FILES_NOT_FOUND);

        return undefined;
    }

    return resolvedPaths;
};

const _getCultureInterfacePath = async (): Promise<string | undefined> => {
    const path = await FileUtils.findFirst(config.cultureInterfacePath);

    // BSCOTT - is this the right place to be handling errors?
    if (path == null) {
        WindowUtils.error(ERROR_CULTURE_INTERFACE_NOT_FOUND);

        return undefined;
    }

    return path;
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const ProjectUtils = {
    get,
    getCultureFiles,
    getCultureInterface,
    getCultureInterfaceFile,
    initializeFromConfig,
};

// #endregion Exports
