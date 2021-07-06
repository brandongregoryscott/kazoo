import assert from "assert";
import { describe, beforeEach, afterEach } from "mocha";
import * as kazoo from "../../extension";
import { TestFixtures, TestUtils } from "../test-utils";
import { ProjectUtils } from "../../utilities/project-utils";
import _ from "lodash";
import { InsertionPosition } from "../../enums/insertion-position";
import { NodeUtils } from "../../utilities/node-utils";
import { SourceFileUtils } from "../../utilities/source-file-utils";
import { shouldActivate } from "../shared/specs";
import {
    whenEndPosition,
    whenLooseAlphabetical,
    whenStartPosition,
    whenStrictAlphabetical,
} from "../shared/describes";
import { Language } from "../../enums/language";
import faker from "faker";
import sinon from "sinon";
import { StringUtils } from "../../utilities/string-utils";

suite("kazoo", () => {
    // -----------------------------------------------------------------------------------------
    // #region Setup
    // -----------------------------------------------------------------------------------------

    const { findPropertyIndexByName } = NodeUtils;

    let translateStub: sinon.SinonStub;
    beforeEach(async () => {
        await TestUtils.resetConfig();

        translateStub = sinon
            .stub(StringUtils, "translate")
            .resolves(faker.random.words());
    });

    afterEach(() => {
        translateStub.restore();
    });

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

            whenLooseAlphabetical(() => {
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

            whenStrictAlphabetical(() => {
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

            whenStartPosition(() => {
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

            whenEndPosition(() => {
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
        describe("given culture file has spread assignment in object literal", () => {
            beforeEach(async () => {
                const tmpDirectory = TestUtils.copyFixturesToTmpDirectory(
                    TestFixtures.Issue15
                );
                await TestUtils.mergeConfigForTmpDirectory(tmpDirectory);

                await shouldActivate();
            });

            whenLooseAlphabetical(() => {
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
                        Language.Spanish
                    );

                    // Assert
                    assert.equal(
                        result.length,
                        cultureFiles.length,
                        "Expected number of translations to match number of culture files found."
                    );

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

        /**
         * https://github.com/brandongregoryscott/kazoo/issues/17
         */
        describe("given culture file has 100+ entries", () => {
            beforeEach(async () => {
                const tmpDirectory = TestUtils.copyFixturesToTmpDirectory(
                    TestFixtures.SixHundredKeys
                );
                await TestUtils.mergeConfigForTmpDirectory(tmpDirectory);

                await shouldActivate();
            });

            whenStrictAlphabetical(() => {
                const expected = 1.25;

                test(`performs full sort of culture file in under ${expected}s`, async () => {
                    // Arrange
                    await TestUtils.mergeConfig({
                        insertionPosition: InsertionPosition.StrictAlphabetical,
                    });
                    const start = new Date();
                    const key = faker.random.word();
                    const translation = faker.random.words();

                    // Act
                    await kazoo.addTranslationToCultureFiles(key, translation);

                    // Assert
                    const end = new Date();
                    const elapsedSeconds: number =
                        ((end as any) - (start as any)) / 1000;
                    assert.equal(
                        elapsedSeconds <= expected,
                        true,
                        `Expected '${InsertionPosition.StrictAlphabetical}' sorting to complete in ${expected}s or less. Actual: ${elapsedSeconds}`
                    );
                });
            });
        });
    });

    // #endregion addTranslationToCultureFiles
});
