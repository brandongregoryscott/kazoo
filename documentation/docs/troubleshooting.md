# Troubleshooting

## Logs

A log file is generated in the root of the workspace directory named `kazoo.log`. Generally, this file
will be created regardless of whether errors/warnings occur, and may be empty. If you encounter
an error or warning while using kazoo, be sure to check the log file for more information.

For example, when using the [Replace translations from file](commands/replace-translations-from-file) command,
you may receive a warning toast when there are keys encountered in the file that do not exist in the culture file.

The log should have an entry similar to this, which provides more detail on the keys:

`[2021-09-14T13:04:11.779] [WARN] kazoo - Keys not found: doesNotExist,xyz`

Note that logging was added later on in development, so some of the older commands are likely missing
additional messaging. However, there should be a global exception handler which captures any unhandled errors and
writes a log statement with the function name prepended.

## Keys are being inserted in unexpected locations

Double check your [Insertion Position](settings/insertion-position) settings. If set to [Loose Alphabetical](settings/insertion-position#loose-alphabetical), it's possible your files have some keys that are out of order and are throwing
the index calculation off. Try switching to [Strict Alphabetical](settings/insertion-position#strict-alphabetical) for
an insert to get the file back in correct order.
