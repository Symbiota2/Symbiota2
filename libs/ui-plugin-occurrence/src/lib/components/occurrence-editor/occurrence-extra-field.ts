export interface OccurrenceExtraField {
    readonly i18nStr: string;
    readonly type?: 'text' | 'number' | 'date';
    value: string;
}
