const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
    title: "kazoo",
    tagline:
        "Ease the burden of adding localized keys and strings to multiple typed culture files",
    url: "https://kazoo.brandonscott.me/",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "assets/banner.png",
    organizationName: "brandongregoryscott",
    projectName: "kazoo",

    presets: [
        [
            "@docusaurus/preset-classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl:
                        "https://github.com/brandongregoryscott/kazoo/edit/main/documentation/",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            colorMode: {
                defaultMode: "dark",
            },
            navbar: {
                title: "Home",
                logo: {
                    alt: "kazoo logo",
                    src: "assets/banner.png",
                },
                items: [
                    {
                        type: "dropdown",
                        docId: "commands",
                        position: "left",
                        label: "Commands",
                        items: [
                            {
                                type: "doc",
                                label: "Add key to interface",
                                docId: "commands/add-key-to-interface",
                            },
                            {
                                type: "doc",
                                label: "Add key and translation",
                                docId: "commands/add-key-and-translation",
                            },
                            {
                                type: "doc",
                                label: "Add translation to culture files",
                                docId:
                                    "commands/add-translation-to-culture-files",
                            },
                            {
                                type: "doc",
                                label: "Intersect untranslated keys",
                                docId: "commands/intersect-untranslated-keys",
                            },
                            {
                                type: "doc",
                                label: "Remove key from interface",
                                docId: "commands/remove-key-from-interface",
                            },
                            {
                                type: "doc",
                                label: "Remove translation from culture files",
                                docId:
                                    "commands/remove-translation-from-culture-files",
                            },
                            {
                                type: "doc",
                                label: "Replace translation by key",
                                docId: "commands/replace-translation-by-key",
                            },
                            {
                                type: "doc",
                                label: "Replace translations from file",
                                docId:
                                    "commands/replace-translations-from-file",
                            },
                        ],
                    },
                    {
                        type: "dropdown",
                        docId: "settings",
                        position: "left",
                        label: "Settings",
                        items: [
                            {
                                type: "doc",
                                label: "Culture File Paths",
                                docId: "settings/culture-file-paths",
                            },
                            {
                                type: "doc",
                                label: "Culture Interface Path",
                                docId: "settings/culture-interface-path",
                            },
                            {
                                type: "doc",
                                label: "Insertion Position",
                                docId: "settings/insertion-position",
                            },
                        ],
                    },
                    {
                        type: "doc",
                        docId: "troubleshooting",
                        position: "left",
                        label: "Troubleshooting",
                    },
                    {
                        href: "https://github.com/brandongregoryscott/kazoo",
                        label: "GitHub",
                        position: "right",
                    },
                ],
            },
            footer: {
                links: [
                    {
                        title: "Documentation",
                        items: [
                            {
                                label: "Commands",
                                to: "docs/commands",
                            },
                            {
                                label: "Settings",
                                to: "docs/settings",
                            },
                            {
                                label: "Troubleshooting",
                                to: "docs/troubleshooting",
                            },
                        ],
                    },
                    {
                        title: "External References",
                        items: [
                            {
                                label: "AndcultureCode i18n Wiki",
                                to:
                                    "https://github.com/AndcultureCode/AndcultureCode.JavaScript.Core/wiki/Internationalization-(i18n)",
                            },
                            {
                                label: "Glob Pattern Tester",
                                to:
                                    "https://www.digitalocean.com/community/tools/glob",
                            },
                        ],
                    },
                    {
                        title: "More",
                        items: [
                            {
                                label: "GitHub",
                                href:
                                    "https://github.com/brandongregoryscott/kazoo",
                            },
                            {
                                label: "Install in VS Code",
                                href:
                                    "vscode:extension/brandongregoryscott.kazoo",
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Brandon Scott. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
});
