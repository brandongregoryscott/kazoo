# Settings > `insertionPosition`

## Overview

Controls the position to insert key/translation into files.

## Options

### `End`

Inserts key at the end of the file/object

-   For example, given the following resources object:
    ```ts
    resources: {
        "accountInformation": "Account Information",
        "cancelMySubscription": "Cancel My Subscription",
        "checkOutFaq": "Check out our FAQs",
        "apple": "apple", // The new key would go here
    }
    ```

### `Loose Alphabetical`

Inserts key in best guess alphabetical order

-   Assumes the file is already sorted, and calculates the new index to insert the key.
-   For example, given the following resources object:

    ```ts
    resources: {
        "accountInformation": "Account Information",
        "apple": "apple", // The new key would go here
        "cancelMySubscription": "Cancel My Subscription",
        "checkOutFaq": "Check out our FAQs"
    }
    ```

-   If the object is _not_ in alphabetical order, the key may be inserted in an unexpected location.
-   For example, given the following resources object:

    ```ts
    resources: {
        "accountInformation": "Account Information",
        "checkOutFaq": "Check out our FAQs",
        "cantaloupe": "cantaloupe", // The new key would go here, despite it belonging below 'cancelMySubscription'
        "cancelMySubscription": "Cancel My Subscription",
    }
    ```

### `Start`

Inserts key at the start of the file/object

-   For example, given the following resources object:

    ```ts
    resources: {
        "cantaloupe": "cantaloupe", // The new key would go here
        "accountInformation": "Account Information",
        "cancelMySubscription": "Cancel My Subscription",
        "checkOutFaq": "Check out our FAQs",
    }
    ```

### `Strict Alphabetical`

Inserts key in alphabetical order

-   Performs a full sort on the file, which is pretty slow (3-4 seconds for the culture files).
-   For example, given the following resources object:

    ```ts
    resources: {
        "accountInformation": "Account Information",
        "checkOutFaq": "Check out our FAQs",
        "cancelMySubscription": "Cancel My Subscription",
        "teamManagement": "Team Management",
        "subscriptionDetails": "Subscription Details",
    }
    ```

-   Inserting the key 'cantaloupe' would also re-sort the entire object:

    ```ts
    resources: {
        "accountInformation": "Account Information",
        "cancelMySubscription": "Cancel My Subscription",
        "cantaloupe": "cantaloupe", // The new key would go here
        "checkOutFaq": "Check out our FAQs",
        "subscriptionDetails": "Subscription Details",
        "teamManagement": "Team Management"
    }
    ```

-   Useful if you start to notice multiple discrepancies in the sorting of your file(s) and want to make sure everyone is on the same page.

## Default Value

Defaults to [`Loose Alphabetical`](#loose-alphabetical) due to its relative accuracy and speed. This may be changed in the future to [`Strict Alphabetical`](#strict-alphabetical) if the performance can be improved.
