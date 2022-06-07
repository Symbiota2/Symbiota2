import "reflect-metadata";
const KG_META_PREFIX = 'kg';
const KG_FIELD_PREFIX = `${KG_META_PREFIX}:field`;
const KG_FIELD_LIST_PREFIX = `${KG_META_PREFIX}:fieldList`;
const KGNodeKey = Symbol(`${KG_META_PREFIX}:type`);
const KGRecordIDKey = Symbol(`${KG_META_PREFIX}:recordID`);

export interface KGPropertyType {
    url: string
    graph: string
}

/**
 * Class decorator that describes the Knowledge Graph type that the entity
 * represents
 * @param url The URI identifier
 */
export function KGNode(graphs: KGPropertyType[]) {
    return Reflect.metadata(KGNodeKey, graphs)
}

/**
 * Property decorator that describes which KG property the property corresponds to
 * @param url The KG URI identifier
 */
export function KGProperty(graphs : KGPropertyType[]) {
    return function(instance, propertyName) {
        const metaKey = `${KG_FIELD_PREFIX}:${propertyName}`
        return Reflect.defineMetadata(metaKey, graphs, instance.constructor)
    }
}

/**
 * Property decorator that describes which KG property the property corresponds to for a list
 * of things
 * @param url The KG URI identifier
 */
export function KGEdge(graphs : KGPropertyType[]) {
    return function(instance, propertyName) {
        const metaKey = `${KG_FIELD_LIST_PREFIX}:${propertyName}`;
        return Reflect.defineMetadata(metaKey, graphs, instance.constructor);
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
 * Retrieves the JSON for the given class set by the KGNode decorator
 */
export function getKGNode(cls: any) : KGPropertyType[] {
    return Reflect.getMetadata(KGNodeKey, cls);
}

/**
 * Retrieves the URI for the given propertyName on the given class,
 * set by the KGProperty decorator
 */
export function getKGProperty(cls: any, propertyName: string) : KGPropertyType[] {
    const metaKey = `${KG_FIELD_PREFIX}:${propertyName}`;
    return Reflect.getMetadata(metaKey, cls);
}

/**
 * Retrieves the URI for the given propertyName on the given class,
 * set by the KGPropertyList decorator
 */
export function getKGEdge(cls: any, propertyName: string) : KGPropertyType[] {
    const metaKey = `${KG_FIELD_LIST_PREFIX}:${propertyName}`;
    return Reflect.getMetadata(metaKey, cls);
}

/**
 * Returns the DwC unique identifier for the given class, set by the
 * DwCID decorator
 */
export function KGCoreID(cls: any) {
    return Reflect.getMetadata(KGRecordIDKey, cls);
}

/**
 * Returns whether the given propertyName on the given class is the unique
 * identifier for the class
 */
export function isKGID(cls: any, propertyName: string) {
    return propertyName === KGCoreID(cls);
}
