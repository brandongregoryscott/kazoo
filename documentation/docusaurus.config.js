const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
    title: "kazoo",
    tagline:
        "Ease the burden of adding localized keys and strings to multiple typed culture files",
    url: "https://brandongregoryscott.github.io/",
    baseUrl: "/kazoo/",
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
            navbar: {
                title: "Home",
                logo: {
                    alt: "kazoo logo",
                    src: "assets/banner.png",
                },
                items: [
                    {
                        type: "doc",
                        docId: "commands",
                        position: "left",
                        label: "Commands",
                    },
                    {
                        type: "doc",
                        docId: "settings",
                        position: "left",
                        label: "Settings",
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
                style: "dark",
                links: [
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
