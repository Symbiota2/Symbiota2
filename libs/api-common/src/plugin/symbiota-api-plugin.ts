import { EntityTarget } from 'typeorm';

/**
 * Abstract class that all API plugins should inherit from
 */
export abstract class SymbiotaApiPlugin {
    /**
     * Returns a list of database entities defined by the plugin. These will
     * be added to the database when the plugin is used.
     * TODO: Currently not implemented.
     */
    static entities(): EntityTarget<any>[] {
        return [];
    }
}
