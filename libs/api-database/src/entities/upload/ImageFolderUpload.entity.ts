import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EntityProvider } from '../../entity-provider.class';

// The image folder upload entity contains information about the upload job

@Exclude()
@Entity('imagefolder_upload')
export class ImageFolderUpload extends EntityProvider {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    @Expose()
    id: number;

    @Column()
    filePath: string;

    @Column()
    mimeType: string;

    @Column()
    status: string;

}
