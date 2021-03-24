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
import { CollectionRequest } from './collection-request';
import { ApiBearerAuth } from '@nestjs/swagger';

export function ProtectCollection(collectionIDParam: string) {
    return applyDecorators(
        SetMetadata(META_KEY_COLLID_ROUTE_PARAM, collectionIDParam),
        ApiBearerAuth(),
        UseGuards(JwtAuthGuard, CollectionEditGuard)
    );
}

export const ProtectedCollectionParam = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<CollectionRequest>();
        return request.collectionID;
    }
);
