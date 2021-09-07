import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class OccurrenceIDQuery {
    @ApiProperty()
    @Transform((input) => input ? parseInt(input) : null)
    @IsInt()
    occurrenceID: number;
}

export class OccurrenceIDOrCollectionIDQuery extends PartialType(OccurrenceIDQuery) {
    @IsOptional()
    occurrenceID: number;

    @ApiProperty({ required: false })
    @Transform((input) => input ? parseInt(input) : null)
    @IsInt()
    @IsOptional()
    collectionID: number;
}

export class CommentIDParam {
    @ApiProperty()
    @Transform((input) => input ? parseInt(input) : null)
    @IsInt()
    commentID: number;
}
