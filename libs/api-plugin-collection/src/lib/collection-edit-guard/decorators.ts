import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext, SetMetadata,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '@symbiota2/api-auth';
import {
    CollectionEditGuard,
    META_KEY_COLLID_ROUTE_PARAM
} from './collection-edit.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function ProtectCollection(collectionIDParam: string) {
    return applyDecorators(
        SetMetadata(META_KEY_COLLID_ROUTE_PARAM, collectionIDParam),
        ApiBearerAuth(),
        UseGuards(JwtAuthGuard, CollectionEditGuard)
    );
}
