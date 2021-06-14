declare module "read-excel-file" {
    import { Stream } from "stream";

    type BasicType =
        | string
        | number
        | boolean
        | typeof Date
        | "Integer"
        | "URL"
        | "Email";

    interface SchemaEntryBasic {
        prop: string;
        type: BasicType;
        oneOf?<T>(): T[];
        required?: boolean;
        validate?<T>(value: T): void;
    }

    interface SchemaEntryParsed {
        prop: string;
        parse<T>(value: string): T | undefined;
        oneOf?<T>(): T[];
        required?: boolean;
        validate?<T>(value: T): void;
    }

    // Implementing recursive types in TypeScript:
    // https://dev.to/busypeoples/notes-on-typescript-recursive-types-and-immutability-5ck1
    interface SchemaEntryRecursive {
        prop: string;
        type: Record<string, SchemaEntry>;
        required?: boolean;
    }

    type SchemaEntry =
        | SchemaEntryBasic
        | SchemaEntryParsed
        | SchemaEntryRecursive;

    export type Schema = Record<string, SchemaEntry>;

    export interface Error {
        error: string;
        row: number;
        column: number;
        value?: any;
        type?: SchemaEntry;
    }

    type Cell = string | number | boolean | typeof Date;
    export type Row = Cell[];

    export type Input = string | Stream | Buffer;

    export interface ParsedObjectsResult {
        rows: object[];
        errors: Error[];
    }

    export interface ParseWithSchemaOptions {
        schema: Schema;
        transformData?: (rows: Row[]) => Row[];
        sheet?: number | string;
    }

    export interface ParseWithoutSchemaOptions {
        sheet?: number | string;
    }

    function readXlsxFile(
        input: Input,
        options: ParseWithSchemaOptions
    ): Promise<ParsedObjectsResult>;
    function readXlsxFile(
        input: Input,
        options?: ParseWithoutSchemaOptions
    ): Promise<Row[]>;

    export default readXlsxFile;
}
