import "reflect-metadata";

const DwcRecordTypeKey = Symbol('dwc:type');
const DwcFieldKey = Symbol('dwc:field');

export function DwCRecord(url: string) {
    return Reflect.metadata(DwcRecordTypeKey, url);
}

export function DwCField(url: string) {
    return Reflect.metadata(DwcFieldKey, url);
}

export function dwcRecordType(cls: any) {
    return Reflect.getMetadata(DwcRecordTypeKey, cls);
}

export function dwcField(instance: any, propertyKey: string) {
    return Reflect.getMetadata(DwcFieldKey, instance, propertyKey);
}
