<p align="center">
    <img src="https://raw.githubusercontent.com/brandongregoryscott/kazoo/main/documentation/static/assets/banner.png" width="50%" height="50%"/>
    <br/>
    <a href="https://github.com/brandongregoryscott/kazoo/actions/workflows/build.yaml">
        <img alt="build status" src="https://github.com/brandongregoryscott/kazoo/actions/workflows/build.yaml/badge.svg"/>
    </a>
    <a href="vscode:extension/brandongregoryscott.kazoo">
        <img alt="Visual Studio Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/brandongregoryscott.kazoo.svg?style=flat-square"/>
    </a>
    <a href="https://github.com/prettier/prettier">
        <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"/>
    </a>
    <a href="http://www.typescriptlang.org/">
        <img alt="TypeScript" src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg"/>
    </a>
</p>

VS Code extension to ease the burden of adding localized keys and strings to multiple typed culture files

![Add key to interface and translation to culture files](documentation/static/assets/examples/add-key-and-translation.gif)

## Documentation

For more detailed documentation on commands and settings, check the [docs site](https://brandongregoryscott.github.io/kazoo) hosted on GitHub Pages.

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
            accountInformation: "Account Information",
            cancelMySubscription: "Cancel My Subscription",
            checkOutFaq: "Check out our FAQs",
            subscriptionDetails: "Subscription Details",
            teamManagement: "Team Management",
        },
    }
);
```

See the [AndcultureCode wiki page](<https://github.com/AndcultureCode/AndcultureCode.JavaScript.Core/wiki/Internationalization-(i18n)>) for more information on setting up internationalization in TypeScript.

## How it works

This extension leverages [`ts-morph`](https://github.com/dsherret/ts-morph) under the hood to read & manipulate the TypeScript AST. This means that you don't need the interface or culture files open in your VS Code window for it to perform the manipulations.

> It also means that it manipulates the files from their saved versions on disk - if you have open but unsaved changes in your editor, it's going to yell at you when you try to save because the file on disk will be newer than the version in your editor.

For translating non-English copy, the extension leverages [`@vitalets/google-translate-api`](https://github.com/vitalets/google-translate-api), determining which language to translate to based on the base culture being extended from [`andculturecode-javascript-core`](https://github.com/AndcultureCode/AndcultureCode.JavaScript.Core) (currently supporting Spanish, but can be easily updated).
