import { ApiResponse, getSchemaPath, ApiBody, ApiConsumes, ApiExtraModels } from '@nestjs/swagger';
import { HttpStatus, Type, applyDecorators } from '@nestjs/common';

/**
 * Decorator that specifies the request can return one or many of the given cls
 */
export function ApiResponseOneOrMany<T>(cls: Type<T>) {
    return applyDecorators(
        ApiExtraModels(cls),
        ApiResponse({
            status: HttpStatus.OK,
            schema: {
                oneOf: [
                    { $ref: getSchemaPath(cls) },
                    {
                        type: 'array',
                        items: { $ref: getSchemaPath(cls) }
                    },
                ]
            }
        })
    );
}

/**
 * Decorator that specifies the request can accept one or many of the given cls
 * in the request body
 */
export function ApiBodyOneOrMany<T>(cls: Type<T>) {
    return applyDecorators(
        ApiExtraModels(cls),
        ApiBody({
            schema: {
                oneOf: [
                    { $ref: getSchemaPath(cls) },
                    {
                        type: 'array',
                        items: { $ref: getSchemaPath(cls) }
                    },
                ]
            }
        })
    );
}

/**
 * Decorator that specifies the request is of type multipart/form-data, where
 * fieldName contains the file data
 */
export function ApiFileInput(fieldName: string) {
    return applyDecorators(
        ApiConsumes('multipart/form-data'),
        ApiBody({
            schema: {
                type: 'object',
                properties: {
                    [fieldName]: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        })
    );
}
