import { EntityTarget } from 'typeorm';

export abstract class SymbiotaApiPlugin {
    static entities(): EntityTarget<any>[] {
        return [];
    }
}
