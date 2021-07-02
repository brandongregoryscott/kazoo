import { InterfaceDeclaration, Project, SourceFile } from "ts-morph";
import { ConfigUtils } from "./config-utils";
import { WindowUtils } from "./window-utils";
import { FileUtils } from "./file-utils";
import { StringUtils } from "./string-utils";
import { LanguageCodeMap } from "../constants/language-code-map";
import { NodeUtils } from "./node-utils";

// -----------------------------------------------------------------------------------------
// #region Variables
// -----------------------------------------------------------------------------------------

let _project: Project = new Project();

// #endregion Variables

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const get = (): Project => _project;

const getCultureFileByLanguage = async (
    language: keyof typeof LanguageCodeMap
): Promise<SourceFile | undefined> => {
    const cultureFiles = await getCultureFiles();

    return cultureFiles.find((cultureFile: SourceFile) =>
        cultureFile
            .getBaseNameWithoutExtension()
            .includes(language.toLowerCase())
    );
};

const getCultureFiles = async (): Promise<SourceFile[]> => {
    const paths = await _getCultureFilePaths();
    if (paths == null) {
        throw new Error(_getCultureFilesNotFoundError());
    }

    // If the paths have been resolved, add the source files just in-case they weren't present during initialization
    _project.addSourceFilesAtPaths(paths);

    const files = _project.getSourceFiles(paths);
    await Promise.all(files.map((file) => file.refreshFromFileSystem()));
    return files;
};

const getCultureInterface = async (): Promise<InterfaceDeclaration> =>
    await (await getCultureInterfaceFile()).getInterfaces()[0];

const getCultureInterfaceFile = async (): Promise<SourceFile> => {
    const path = await _getCultureInterfacePath();
    if (path == null) {
        throw new Error(_getCultureInterfaceNotFoundError());
    }

    // If the path has been resolved, add the source file just in-case it wasn't present during initialization
    _project.addSourceFileAtPathIfExists(path);

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
    const { cultureFilePaths } = ConfigUtils.get();
    const resolvedPaths = await FileUtils.findAll(cultureFilePaths);

    if (resolvedPaths.length <= 0) {
        WindowUtils.error(_getCultureFilesNotFoundError());

        return undefined;
    }

    return resolvedPaths;
};

const _getCultureFilesNotFoundError = (): string => {
    const paths = ConfigUtils.get().cultureFilePaths.join(", ");

    return `Error - no culture files could be found matching patterns '${paths}'. Please check the paths in your settings.`;
};

const _getCultureInterfaceNotFoundError = (): string => {
    const { cultureInterfacePath: path } = ConfigUtils.get();

    return `Error - culture interface could not be found matching path '${path}'. Please check the path in your settings.`;
};

const _getCultureInterfacePath = async (): Promise<string | undefined> => {
    const { cultureInterfacePath } = ConfigUtils.get();
    const path = await FileUtils.findFirst(cultureInterfacePath);

    if (path == null) {
        WindowUtils.error(_getCultureInterfaceNotFoundError());

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
    getCultureFileByLanguage,
    getCultureFiles,
    getCultureInterface,
    getCultureInterfaceFile,
    initializeFromConfig,
};

// #endregion Exports
