import * as vscode from "vscode";

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const find = async (path: string): Promise<string[]> => {
    const uris = await vscode.workspace.findFiles(path, "**/node_modules/**");
    return uris.map((uri) => uri.fsPath);
};

const findAll = async (paths: string[]): Promise<string[]> => {
    const findPromises = paths.map((path) => find(path));
    const flattenedPaths: string[] = [];
    (await Promise.all(findPromises)).map((paths) =>
        flattenedPaths.push(...paths)
    );
    return flattenedPaths;
};

const findFirst = async (path: string): Promise<string | undefined> =>
    (await find(path))[0];

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export const FileUtils = {
    find,
    findAll,
    findFirst,
};

// #endregion Exports
