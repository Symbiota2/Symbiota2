export type InsideTempDirCallback = ((string) => void) | ((string) => Promise<void>);

/*
All interfaces prefixed by DwCAMeta come from the archive schema defined at
https://dwc.tdwg.org/text/tdwg_dwc_text.xsd
 */

export interface DwCAMetaFileAttributes {
    dateFormat?: string;
    encoding?: string;
    fieldsTerminatedBy?: string;
    linesTerminatedBy?: string;
    fieldsEnclosedBy?: string;
    ignoreHeaderLines?: string;
    rowType?: string;
}
