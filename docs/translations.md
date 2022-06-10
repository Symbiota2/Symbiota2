# Translations

_by Curtis Dyreson_

This document describes how to perform and control translations. Symbiota2 translates the front-end into various languages.  The available languages can be found from the Symbiota2 home page using the drop-down menu (currently) located on the upper right of the screen.

## Setting up translations
Symbiota2 uses the Google translate cloud service to translate.  The service can translate to any language in the <a href=" https://cloud.google.com/translate/docs/languages">list of supported languages</a>.  To perform a translation the service needs a Google API key.  You will have to generate this key and store it into the file

    ${SYMBIOTA2_HOME}/bin/gCloudTranslateKey.txt

The process of generating the key is <a href="https://cloud.google.com/translate/docs/setup">described here</a>.

## Symbiota2 translatable fields
A user-interface page in Symbiota2 frequently contains text that is a candidate for translation.  For example, consider the taxonomy viewer page located in the development code repository at

    ${SYMBIOTA2_HOME}/libs/ui-plugin-taxonomy/src/pages/taxa-viewer/

The Angularized HTML for the page is the `taxa-viewer-page.html` file within that directory.  In the HTML file, there is the following line that is the title for the page.

    <h1>{{ "taxonomy.viewer.title" | translate }}</h1>

The text for the title is stored in a JSON language file that maps a key like `taxonomy.viewer.title` to the corresponding text in a specific language.  The translation is provided by piping the key into the `translate` service in the above snippet of HTML.  There is one JSON file for each language that has all the mappings from text keys to the translated text value.  For example the English JSON file (`en.json`) the following key/value pair.

    ...
    "taxonomy.viewer.title": "Taxonomy Viewer",
    ...

When the page is rendered and the user has selected "English" as the chosen language the title is replaced with the value of the field as follows.

    <h1>Taxonomy Viewer</h1>

If the user had chosen Spanish then the Spanish JSON file (`es.json`) would be consulted, and since it has the following key/value pair

    ...
    "taxonomy.viewer.title": "Visor de taxonomía",
    ...

the title would be rendered as follows.

    <h1>Visor de taxonomía</h1>

## Editable and Translatable fields
To provide more control for site managers, Symbiota2 also supports editable translations.  To set up an editable field, use either the `symbiota2-editable-text` or `symbiota2-editable-paragraph` components.  The components are the same except that the text component supports a single line of text, while the paragraph component can be used to edit an entire paragraph (it uses the Quill rich-text editor package).  Each component takes as input a `key` and for users that have text-editing permission will allow a user to open an editing dialog (using a blue pencil button).  The blue pencil button will only be present if a user has permission to edit the project and only if `Edit` mode is selected.  After logging in the navbar will display an `Edit` button to indicate that the user should activate the button to get permission to `Edit` the translatable fields in a page.  Select `View` to switch to `View` mode.

As an example of the use of an editable field consider the HTML code in a component to allow editing of the taxonomy viewer title.

    <h1><symbiota2-editable-text key='taxonomy.profiler.entry.title'></symbiota2-editable-text></h1>

If the user does not have permission to edit (or editing is turned off) then the component will convert to the non-editable, translatable representation of the title.  But if permitted editing will be turned (and a blue pencil will appear).
## Where are the language JSON files?
The language JSON files are local to each plugin (and in various common UI directories).  In the taxonomy UI plugin they are located in the directory.

    ${SYMBIOTA2_HOME}/libs/ui-plugin-taxonomy/src/i18n/

Each i18n folder has the following structure to accommodate automated translation while providing a measure of user control.

    i18n
        notranslate
        translate
            default
               generated
            modifications
               generated

We describe each kind of translation below.

### Default translation
The directory `i18n/translate/default`  contains the default translation.  This directory contains **one source language file** and a `generated` directory to hold all of the translations (as performed by Google translate) of the source.  The source file could be in any language.  The language is specified as a two character name of the file, e.g., for English the file would `en.json`.   But if a site decides that Spanish should be the default language used for translation, then the `translate/default` directory would contain an `es.json` file.  If any changes are made to the source file, then the translations can be automatically run by executing the following commands in a terminal.

       npm run i18n:translate
       npm run i18n

All of the language files will be translated by the first command and then the translations merged into an *asset* that is loaded (dynamically) into the Symbiota2 Angular server.

### Modifications of the default translation
The directory `i18n/translate/modifications`  contains the translation modifications.  This directory contains potentially several **source language file** and a `generated` directory to hold all of the translations (as performed by Google translate) of the source.  A source file could be in any language.  For instance the directory may contain both an`en.json` and `es.json` file.  The files will have any specific modifications of the default translations.  Modifications are translated and applied after the default and the translated modifications end up in the `generated` directory.  The command

       npm run i18n:translate

will first do the default translations and then the modification translations.  The modifications are run in alphabetic order and the translations are appended to the generated language files.  The modifications are merged by the command

       npm run i18n

by appending the modified language files to the default language files when building the language *asset* (so they overwrite the default key/value bindings).

When editing a text field using the `symbiota2-editable-text` component, a user will be prompted to choose whether to *translate* the edit.  If they choose to do so then the edit will be appended to the corresponding modification language file (and automatically translated next time a translation is run).

### One-off modifications
The directory `i18n/notranslate`  contains language-specific modifications that are not translated to other languages and are applied last.  The directory may hold several language files, in any language.  For instance the directory may contain both an`en.json` and `es.json` file.  The files will have any one-off modifications of the translations.  One-off modifications are merged last when executing the following command

       npm run i18n

The one-off modifications are appended last when building the language *asset* (so they overwrite the default and modified key/value bindings) for a specific language.

When editing a text field using the `symbiota2-editable-text` component, a user will be prompted to choose whether to *translate* the edit.  If they choose not to do so then the edit will be appended to the corresponding `notranslate` language file as a one-off modification.
> Written with [StackEdit](https://stackedit.io/).
