import { SourceFile } from "ts-morph";
import * as vscode from "vscode";
import { SharedConstants } from "../constants/shared-constants";

// -----------------------------------------------------------------------------------------
// #region Interfaces
// -----------------------------------------------------------------------------------------

interface MessageOption {
    value: string;
    onSelection: (value: string) => void;
}

// #endregion Interfaces

// -----------------------------------------------------------------------------------------
// #region Constants
// -----------------------------------------------------------------------------------------

const { RESOURCES } = SharedConstants;

// #endregion Constants

// -----------------------------------------------------------------------------------------
// #region Public Functions
// -----------------------------------------------------------------------------------------

const WindowUtils = {
    error(value: string, ...options: MessageOption[]): void {
        showMessage(vscode.window.showErrorMessage)(value, ...options);
    },
    errorResourcesNotFound(file: SourceFile): void {
        const fileName = file.getBaseName();
        const message = `Expected to find object literal with key '${RESOURCES}' in ${fileName}.`;
        this.error(message);
    },
    info(value: string, ...options: MessageOption[]): void {
        showMessage(vscode.window.showInformationMessage)(value, ...options);
    },
    prefilledPrompt(
        prompt: string,
        value: string
    ): Thenable<string | undefined> {
        return vscode.window.showInputBox({
            prompt,
            value,
            ignoreFocusOut: true,
        });
    },
    prompt(prompt: string): Thenable<string | undefined> {
        return vscode.window.showInputBox({
            prompt,
            ignoreFocusOut: true,
        });
    },
    selection(options: string[]): Thenable<string | undefined> {
        return vscode.window.showQuickPick(options, {
            ignoreFocusOut: true,
        });
    },
    warning(value: string, ...options: MessageOption[]): void {
        showMessage(vscode.window.showWarningMessage)(value, ...options);
    },
};

// #endregion Public Functions

// -----------------------------------------------------------------------------------------
// #region Private Functions
// -----------------------------------------------------------------------------------------

const showMessage = (
    messageFn: (
        value: string,
        ...optionsValues: string[]
    ) => Thenable<string | undefined>
) => (value: string, ...options: MessageOption[]): void => {
    const values = options.map((option: MessageOption) => option.value);
    const promise = messageFn(value, ...values);

    const handleSelection = (selected: string | undefined) => {
        if (selected == null) {
            return;
        }

        const handler = options.find(
            (option: MessageOption) => option.value === selected
        )?.onSelection;

        handler?.(selected);
    };

    if (values.length > 0) {
        promise.then(handleSelection);
    }
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { MessageOption, WindowUtils };

// #endregion Exports
