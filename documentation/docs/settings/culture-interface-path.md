# Settings > Culture Interface Path

## Overview

Path/glob pattern to interface defining typed i18n keys

-   Type: `string`
-   Key (in `settings.json`): `kazoo.cultureInterfacePath`

## Examples

Uses [glob pattern matching](<https://en.wikipedia.org/wiki/Glob_(programming)>) to find the **first matching file** to be used for defining keys.

For example, given the following structure and the pattern `**/interfaces/culture-resources.ts`, the culture interface path would be matched as `interfaces/culture-resources.ts`.

```
cultures/
├─ interfaces/
│ ├─ culture-resources.ts
interfaces/
├─ culture-resources.ts
```

If `interfaces/culture-resources.ts` did not exist, the deeper `cultures/interfaces/culture-resources.ts` file would still match.

Glob patterns can be tested online via this [DigitalOcean tool](https://www.digitalocean.com/community/tools/glob).

If desired, you can also forgo the glob pattern and put the actual file path to use. `cultures/interfaces/culture-resources.ts` would match on this exact path, so you wouldn't have to worry about `interfaces/culture-resources.ts` existing in the example above.

_These examples are contrived, and it is recommended to keep just one interface for defining keys._

## Default Value

Defaults to `**/interfaces/culture-resources.ts`, which is loose enough to match a deeply nested, conventionally named `interfaces` folder.
