import "reflect-metadata";
import { core } from '@angular/compiler';

const DWC_META_PREFIX = 'dwc';
const DWC_FIELD_PREFIX = `${DWC_META_PREFIX}:field`;
const DwcRecordTypeKey = Symbol(`${DWC_META_PREFIX}:type`);
const DwcRecordIDKey = Symbol(`${DWC_META_PREFIX}:recordID`);

/**
 * Class decorator that describes the type of DwC record that the class
 * represents
 * @param url The DwC URI identifier
 */
export function DwCRecord(url: string) {
    return Reflect.metadata(DwcRecordTypeKey, url);
}

/**
 * Property decorator that describes which DwC field the property cooresponds
 * to
 * @param url The DwC URI identifier
 */
export function DwCField(url: string) {
    return function(instance, propertyName) {
        const metaKey = `${DWC_FIELD_PREFIX}:${propertyName}`;
        return Reflect.defineMetadata(metaKey, url, instance.constructor);
    }
}

/**
 * Property decorator that marks the property as the unique identifier for the
 * record in a Darwin Core Archive
 */
export function DwCID() {
    return function(instance, propertyName) {
        return Reflect.defineMetadata(
            DwcRecordIDKey,
            propertyName,
            instance.constructor
        );
    }
}

/**
 * Retrieves the URI for the given class set by the DwCRecord decorator
 */
export function dwcRecordType(cls: any) {
    return Reflect.getMetadata(DwcRecordTypeKey, cls);
}

/**
 * Retrieves the Darwin Core URI for the given propertyName on the given class,
 * set by the DwCField decorator
 */
export function getDwcField(cls: any, propertyName: string) {
    const metaKey = `${DWC_FIELD_PREFIX}:${propertyName}`;
    return Reflect.getMetadata(metaKey, cls);
}

/**
 * Returns the DwC unique identifier for the given class, set by the
 * DwCID decorator
 */
export function dwcCoreID(cls: any) {
    return Reflect.getMetadata(DwcRecordIDKey, cls);
}

/**
 * Returns whether the given propertyName on the given class is the unique
 * identifier for the class
 */
export function isDwCID(cls: any, propertyName: string) {
    return propertyName === dwcCoreID(cls);
}
