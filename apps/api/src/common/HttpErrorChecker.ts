import { NotFoundException } from '@nestjs/common';

export abstract class HttpErrorChecker {
    /**
     * Returns a 404 if obj is null
     * @param obj The data object to check
     * @private
     */
    protected static checkNotFound(obj: any) {
        if (obj === null) {
            throw new NotFoundException();
        }
        return obj;
    }
}
