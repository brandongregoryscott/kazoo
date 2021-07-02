import assert from "assert";
import vscode from "vscode";
import { describe, beforeEach } from "mocha";
import * as kazoo from "../../extension";
import { TestFixtures, TestUtils } from "../test-utils";
import { ProjectUtils } from "../../utilities/project-utils";
import _ from "lodash";
import { InsertionPosition } from "../../enums/insertion-position";
import { NodeUtils } from "../../utilities/node-utils";
import { SourceFileUtils } from "../../utilities/source-file-utils";
import { PropertyAssignment } from "ts-morph";

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

    const { findPropertyIndexByName } = NodeUtils;

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

    // -----------------------------------------------------------------------------------------
    // #region addTranslationToCultureFiles
    // -----------------------------------------------------------------------------------------

    describe("addTranslationToCultureFiles", () => {
        /**
         * https://github.com/brandongregoryscott/kazoo/issues/15
         */
        describe("given culture file has split object literals", () => {
            beforeEach(async () => {
                const tmpDirectory = TestUtils.copyFixturesToTmpDirectory(
                    TestFixtures.Issue15
                );
                await TestUtils.mergeConfigForTmpDirectory(tmpDirectory);

                await shouldActivate();
            });

            describe(`when insertionPosition '${InsertionPosition.LooseAlphabetical}'`, () => {
                test("inserts translation into culture file at expected position, returns list of translations", async () => {
                    // Arrange
                    const key = "not-found-page-description";
                    const expectedAfterKey = "login-offline-warning";
                    const expectedBeforeKey = "offline-removeOfflineBookError";
                    const translation = "Not found page";

                    // Act
                    const result = await kazoo.addTranslationToCultureFiles(
                        key,
                        translation
                    );
                    const cultureFiles = await ProjectUtils.getCultureFiles();
                    const cultureFile = await ProjectUtils.getCultureFileByLanguage(
                        "Spanish"
                    );

                    // Assert
                    assert.equal(result.length, cultureFiles.length);

                    const resourceObject = SourceFileUtils.getResourcesObject(
                        cultureFile!
                    );
                    const properties = NodeUtils.getPropertyAssignments(
                        resourceObject!
                    );
                    const expectedAfterIndex = findPropertyIndexByName(
                        expectedAfterKey,
                        properties
                    );
                    const expectedBeforeIndex = findPropertyIndexByName(
                        expectedBeforeKey,
                        properties
                    );

                    const actualIndex = findPropertyIndexByName(
                        key,
                        properties
                    );

                    assert.equal(
                        actualIndex,
                        expectedBeforeIndex - 1,
                        `Expected '${key}' to appear alphabetically before '${expectedBeforeKey}'`
                    );
                    assert.equal(
                        actualIndex,
                        expectedAfterIndex + 1,
                        `Expected '${key}' to appear alphabetically after '${expectedAfterKey}'`
                    );
                });
            });
        });
    });

    // #endregion addTranslationToCultureFiles
});
