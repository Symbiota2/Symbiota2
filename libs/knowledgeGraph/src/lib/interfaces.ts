export const DWC_SCHEMA_LOCATION = 'http://rs.tdwg.org/dwc/text/ http://dwc.tdwg.org/text/tdwg_dwc_text.xsd';
export const DWC_XML_NS = 'http://rs.tdwg.org/dwc/text/';
export type DwCAParseCallback = (tmpdir: string, archive: IKGAMeta) => any;

/*
All interfaces prefixed by DwCAMeta come from the archive schema defined at
https://dwc.tdwg.org/text/
Helpful: http://tools.gbif.org/dwca-assistant/gbif_dwc-a_asst_en_v1.1.pdf
 */

/*
The full meta.xml for a dwc archive
 */
export interface IKGAMeta {
    archive: {
        $: {
            xmlns: string;
            metadata?: string;
            "xmlns:xsi": string;
            "xsi:schemaLocation": string;
            "xmlns:xs"?: string;
        }
        core: IKGAMetaCoreFileType;
        extension?: IKGAMetaExtensionFileType[];
    }
}

/*
A core file within the archive
 */
export interface IKGAMetaCoreFileType extends IKGAMetaFileType {
    id?: IKGAMetaIDFieldType;
}

/*
An extension file within the archive
 */
export interface IKGAMetaExtensionFileType extends IKGAMetaFileType {
    coreid: IKGAMetaIDFieldType;
}

/*
List of data files within the archive
 */
export interface IKGAMetaFileLocationType {
    location: string[];
}

/*
Attributes shared across all file types, core or extensions
 */
export interface IKGAMetaFileType {
    $: {
        rowType: 'http://rs.tdwg.org/dwc/terms/Occurrence' | 'http://rs.tdwg.org/dwc/terms/Taxon';
        fieldsTerminatedBy?: string;
        linesTerminatedBy?: string;
        fieldsEnclosedBy?: string;
        encoding?: string;
        ignoreHeaderLines?: number;
        dateFormat?: string;
    },
    files: IKGAMetaFileLocationType[];
    field: IKGAMetaFieldType[];
}

/*
A field within one of the archive data files
 */
export interface IKGAMetaFieldType {
    $: {
        index?: number;
        term: string;
        default?: string;
        vocabulary?: string;
    }
}

/*
Defines the column that's the primary key for the given file
 */
export interface IKGAMetaIDFieldType {
    $: {
        index?: number;
    }
}

// https://dwc.tdwg.org/terms



