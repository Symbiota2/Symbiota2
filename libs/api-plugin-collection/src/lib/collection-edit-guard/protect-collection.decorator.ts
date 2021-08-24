import {
    applyDecorators,
    SetMetadata,
    UseGuards
} from '@nestjs/common';
import {
    CollectionEditGuard, META_KEY_COLLID_IN_QUERY,
    META_KEY_COLLID_PARAM
} from './collection-edit.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

interface ProtectCollectionOpts {
    isInQuery?: boolean;
}

export function ProtectCollection(collectionIDParam: string, opts?: ProtectCollectionOpts) {
    const isInQuery = opts && opts.isInQuery && opts.isInQuery === true;

    return applyDecorators(
        SetMetadata(META_KEY_COLLID_PARAM, collectionIDParam),
        SetMetadata(META_KEY_COLLID_IN_QUERY, isInQuery),
        ApiBearerAuth(),
        UseGuards(CollectionEditGuard)
    );
}
