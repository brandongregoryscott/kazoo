# Settings > Culture File Paths

## Overview

Array of paths/glob patterns to culture files

-   Type: `string[]`
-   Key (in `settings.json`): `kazoo.cultureFilePaths`

## Examples

Uses [glob pattern matching](<https://en.wikipedia.org/wiki/Glob_(programming)>) to find the matching files used for holding translated copy.

For example, given the following structure and the pattern `**/cultures/*.ts`, both `cultures/english-united-states.ts` and `cultures/spanish-spain.ts` would match.

```
cultures/
├─ english-united-states.ts
├─ spanish-spain.ts
```

Glob patterns can be tested online via this [DigitalOcean tool](https://www.digitalocean.com/community/tools/glob).

If you wanted to specify culture files individually by their paths, setting the value to `["cultures/english-united-states.ts", "cultures/spanish-spain.ts"]` would also work.

## Default Value

Defaults to `["**/cultures/*.ts"]`, which is loose enough to match a deeply nested, conventionally named `cultures` folder and any TypeScript source files in it.
