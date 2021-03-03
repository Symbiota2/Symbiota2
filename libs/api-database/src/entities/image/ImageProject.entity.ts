import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ImageProjectLink } from './ImageProjectLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Entity('imageprojects')
export class ImageProject extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'imgprojid' })
    id: number;

    @Column('varchar', { name: 'projectname', length: 75 })
    name: string;

    @Column('varchar', { name: 'managers', nullable: true, length: 150 })
    managers: string;

    @Column('varchar', { name: 'description', nullable: true, length: 1000 })
    description: string;

    @Column('int', { name: 'ispublic', default: () => '\'1\'' })
    isPublic: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('int', { name: 'uidcreated', nullable: true })
    creatorUID: number | null;

    @Column('int', {
        name: 'sortsequence',
        nullable: true,
        default: () => '\'50\'',
    })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ImageProjectLink,
        (imageprojectlink) => imageprojectlink.imageProject
    )
    links: Promise<ImageProjectLink[]>;
}
