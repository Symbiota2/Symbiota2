import "reflect-metadata";
import { core } from '@angular/compiler';

const KG_META_PREFIX = 'kg';
const KG_FIELD_PREFIX = `${KG_META_PREFIX}:field`;
const KGRecordTypeKey = Symbol(`${KG_META_PREFIX}:type`);
const KGRecordIDKey = Symbol(`${KG_META_PREFIX}:recordID`);

/**
 * Class decorator that describes the Knowledge Graph type that the entity
 * represents
 * @param url The URI identifier
 */
export function KGType(url: string) {
    return Reflect.metadata(KGRecordTypeKey, url);
}

/**
 * Property decorator that describes which KG property the property corresponds
 * to
 * @param url The DwC URI identifier
 */
export function KGProperty(url: string) {
    return function(instance, propertyName) {
        const metaKey = `${KG_FIELD_PREFIX}:${propertyName}`;
        return Reflect.defineMetadata(metaKey, url, instance.constructor);
    }
}

/**
 * Property decorator that marks the property as part of an identifier
 */
export function KGID() {
    return function(instance, propertyName) {
        return Reflect.defineMetadata(
            KGRecordIDKey,
            propertyName,
            instance.constructor
        );
    }
}

/**
 * Retrieves the URI for the given class set by the KGRecord decorator
 */
export function KGRecordType(cls: any) {
    return Reflect.getMetadata(KGRecordTypeKey, cls);
}

/**
 * Retrieves the URI for the given propertyName on the given class,
 * set by the KGProperty decorator
 */
export function getKGProperty(cls: any, propertyName: string) {
    const metaKey = `${KG_FIELD_PREFIX}:${propertyName}`;
    return Reflect.getMetadata(metaKey, cls);
}

/**
 * Returns the DwC unique identifier for the given class, set by the
 * DwCID decorator
 */
export function dwcCoreID(cls: any) {
    return Reflect.getMetadata(KGRecordIDKey, cls);
}

/**
 * Returns whether the given propertyName on the given class is the unique
 * identifier for the class
 */
export function isDwCID(cls: any, propertyName: string) {
    return propertyName === dwcCoreID(cls);
}
