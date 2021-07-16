import path from "path";
import Mocha from "mocha";
import glob from "glob";

export function run(): Promise<void> {
    // Create the mocha test
    const mocha = new Mocha({
        ui: "tdd",
        color: true,
    });
    mocha.timeout(30000);

    const testsRoot = path.resolve(__dirname, "..");

    return new Promise((pass, fail) => {
        glob("**/**.test.js", { cwd: testsRoot }, (err, files) => {
            if (err) {
                return fail(err);
            }

            // Add files to the test suite
            files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

            try {
                // Run the mocha test
                mocha.run((failures: number) => {
                    if (failures > 0) {
                        fail(new Error(`${failures} tests failed.`));
                    } else {
                        pass();
                    }
                });
            } catch (err) {
                console.error(err);
                fail(err);
            }
        });
    });
}
