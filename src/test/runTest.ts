import * as path from "path";
import { runTests } from "vscode-test";
import shell from "shelljs";

async function main() {
    try {
        const ci = process.argv.includes("--ci");

        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, "../../");

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, "./suite/index");

        // Launch args - will open VS Code to the first path - ensures there's a workspace
        // whether run via CLI or VS Code debugger
        const launchArgs: string[] = [shell.pwd()];

        console.log(`extensionDevelopmentPath: ${extensionDevelopmentPath}`);
        console.log(`extensionTestsPath: ${extensionTestsPath}`);
        console.log(`launchArgs: ${launchArgs.join(", ")}`);

        // Download VS Code, unzip it and run the integration test
        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs,
            extensionTestsEnv: {
                CI: ci.toString(),
            },
        });
    } catch (err) {
        console.error("Failed to run tests");
        process.exit(1);
    }
}

main();
