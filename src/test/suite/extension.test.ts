import assert from "assert";
import vscode from "vscode";
import { describe, beforeEach } from "mocha";
import * as kazoo from "../../extension";
import { TestFixtures, TestUtils } from "../test-utils";
import { ProjectUtils } from "../../utilities/project-utils";
import _ from "lodash";
import { InsertionPosition } from "../../enums/insertion-position";

suite("kazoo", () => {
    // -----------------------------------------------------------------------------------------
    // #region Setup
    // -----------------------------------------------------------------------------------------

    const shouldActivate = async () => {
        // Arrange
        const extension = vscode.extensions.getExtension(
            "brandongregoryscott.kazoo"
        );

        // Act
        await extension?.activate();

        // Assert
        assert.equal(extension?.isActive, true);
    };

    // #endregion Setup

    test("should activate extension", shouldActivate);

    // -----------------------------------------------------------------------------------------
    // #region addKeyToInterface
    // -----------------------------------------------------------------------------------------

    describe("addKeyToInterface", () => {
        beforeEach(() => {
            TestUtils.cleanTmpDirectory();
        });

        describe("given interface is empty", () => {
            beforeEach(async () => {
                const tmpDirectory = TestUtils.copyFixturesToTmpDirectory(
                    TestFixtures.Empty
                );
                await TestUtils.mergeConfigForTmpDirectory(tmpDirectory);

                await shouldActivate();
            });

            test("inserts key into interface, returns created key", async () => {
                // Arrange
                const key = "testKey";

                // Act
                const result = await kazoo.addKeyToInterface(key);
                const cultureInterface = await ProjectUtils.getCultureInterface();

                // Assert
                assert.equal(result, key);
                cultureInterface.getPropertyOrThrow(key);
            });
        });

        describe("given interfaces has alphabetized keys", () => {
            beforeEach(async () => {
                const tmpDirectory = TestUtils.copyFixturesToTmpDirectory(
                    TestFixtures.FiveKeysAlphabetized
                );
                await TestUtils.mergeConfigForTmpDirectory(tmpDirectory);

                await shouldActivate();
            });

            describe(`when insertionPosition '${InsertionPosition.LooseAlphabetical}'`, () => {
                test("inserts key into interface at expected position, returns created key", async () => {
                    // Arrange
                    const key = "testKey";

                    // Act
                    const result = await kazoo.addKeyToInterface(key);
                    const cultureInterface = await ProjectUtils.getCultureInterface();

                    // Assert
                    assert.equal(result, key);
                    cultureInterface.getPropertyOrThrow(key);

                    const properties = cultureInterface.getProperties();
                    assert.equal(_.last(properties)?.getName(), key);
                });
            });

            describe(`when insertionPosition '${InsertionPosition.StrictAlphabetical}'`, () => {
                test("inserts key into interface at expected position, returns created key", async () => {
                    // Arrange
                    const key = "testKey";
                    await TestUtils.mergeConfig({
                        insertionPosition: InsertionPosition.StrictAlphabetical,
                    });

                    // Act
                    const result = await kazoo.addKeyToInterface(key);
                    const cultureInterface = await ProjectUtils.getCultureInterface();

                    // Assert
                    assert.equal(result, key);
                    cultureInterface.getPropertyOrThrow(key);

                    const properties = cultureInterface.getProperties();
                    assert.equal(_.last(properties)?.getName(), key);
                });
            });

            describe(`when insertionPosition '${InsertionPosition.Start}'`, () => {
                test("inserts key into interface at expected position, returns created key", async () => {
                    // Arrange
                    const key = "testKey";
                    await TestUtils.mergeConfig({
                        insertionPosition: InsertionPosition.Start,
                    });

                    // Act
                    const result = await kazoo.addKeyToInterface(key);
                    const cultureInterface = await ProjectUtils.getCultureInterface();

                    // Assert
                    assert.equal(result, key);
                    cultureInterface.getPropertyOrThrow(key);

                    const properties = cultureInterface.getProperties();
                    assert.equal(_.first(properties)?.getName(), key);
                });
            });

            describe(`when insertionPosition '${InsertionPosition.End}'`, () => {
                test("inserts key into interface at expected position, returns created key", async () => {
                    // Arrange
                    const key = "testKey";
                    await TestUtils.mergeConfig({
                        insertionPosition: InsertionPosition.End,
                    });

                    // Act
                    const result = await kazoo.addKeyToInterface(key);
                    const cultureInterface = await ProjectUtils.getCultureInterface();

                    // Assert
                    assert.equal(result, key);
                    cultureInterface.getPropertyOrThrow(key);

                    const properties = cultureInterface.getProperties();
                    assert.equal(_.last(properties)?.getName(), key);
                });
            });
        });
    });

    // #endregion addKeyToInterface
});
