# i18n-ext

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

VS Code extension to ease the burden of adding localized keys and strings to multiple typed culture files

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

-   Assumes the culture files are initialized using an object in the structure of the [`Culture`](https://github.com/AndcultureCode/AndcultureCode.JavaScript.Core/blob/main/src/interfaces/culture.ts) interface from [`andculturecode-javascript-core`](https://github.com/AndcultureCode/AndcultureCode.JavaScript.Core)

```ts
import {
    BaseEnglishUnitedStates,
    Culture,
    LocalizationUtils,
} from "andculturecode-javascript-core";
import CultureResources from "utilities/interfaces/culture-resources";

const EnglishUnitedStates: Culture<CultureResources> = LocalizationUtils.cultureFactory(
    BaseEnglishUnitedStates,
    {
        resources: {
            aboutApp: "About {{appName}}",
            "acceptGroupInvitation-invitedByNameToJoin":
                "{{byName}} invited you {{toJoin}}",
            "acceptGroupInvitation-invitedToJoin":
                "You've been invited {{toJoin}}",
            "acceptGroupInvitation-join": "Join Team",
            // ...
        },
    }
);
```

## Settings

This extension supports the following configuration settings:

-   `i18n-ext.cultureFilePaths`: Array of paths/glob patterns to culture files
    -   Default: `**/cultures/*.ts`
-   `i18n-ext.cultureInterfacePath`: Path/glob pattern to interface defining typed i18n keys
    -   Default: `**/interfaces/culture-resources.ts`
-   `i18n-ext.insertionPosition`: Position to insert key/translation into file
    -   Default: `Loose Alphabetical` (Inserts key in best guess alphabetical order, assuming file is already sorted)
