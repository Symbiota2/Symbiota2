import { ApiResponse, getSchemaPath, ApiBody, ApiConsumes, ApiExtraModels } from '@nestjs/swagger';
import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
    registerDecorator, ValidationArguments,
    ValidationOptions, ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

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
