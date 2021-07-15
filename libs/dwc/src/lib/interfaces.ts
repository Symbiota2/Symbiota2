export type InsideTempDirCallback<T> = (string) => Promise<T>;
export type DwCAParseCallback<T> = (tmpdir: string, archive: DwCAMeta) => Promise<T>;

/*
All interfaces prefixed by DwCAMeta come from the archive schema defined at
https://dwc.tdwg.org/text/tdwg_dwc_text.xsd
 */

/*
The full meta.xml for a dwc archive
 */
export interface DwCAMeta {
    archive: {
        $: {
            xmlns: string;
            metadata?: string;
            "xmlns:xsi": string;
            "xsi:schemaLocation": string;
        }
        core: DwCAMetaCoreFileType[];
        extension?: DwCAMetaExtensionFileType[];
    }
}

/*
A core file within the archive
 */
export interface DwCAMetaCoreFileType extends DwCAMetaFileType {
    id?: DwCAMetaIDFieldType;
    files: DwCAMetaFileType[];
    field: DwCAMetaFieldType[];
}

/*
An extension file within the archive
 */
export interface DwCAMetaExtensionFileType extends DwCAMetaFileType {
    coreid: DwCAMetaIDFieldType[];
    field: DwCAMetaFieldType[];
}

/*
Attributes shared across all file types, core or extensions
 */
export interface DwCAMetaFileType {
    $: {
        rowType: string;
        dateFormat?: string;
        encoding?: string;
        fieldsTerminatedBy?: string;
        linesTerminatedBy?: string;
        fieldsEnclosedBy?: string;
        ignoreHeaderLines?: number;
    }
}

/*
A field within one of the archive data files
 */
export interface DwCAMetaFieldType {
    $: {
        term: string;
        index?: number;
        default?: string;
        vocabulary?: string;
        delimitedBy?: string;
    }
}

/*
Defines the column that's the primary key for the given file
 */
export interface DwCAMetaIDFieldType {
    $: {
        index?: number;
    }
}

/*
List of data files within the archive
 */
export interface DwCAMetaFileType {
    location: string[];
}
