import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../collection';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('specprocessorprojects')
export class SpeciesProcessorProject extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'spprid', unsigned: true })
    id: number;

    @Column('int', { name: 'collid', unsigned: true })
    collectionID: number;

    @Column('varchar', { name: 'title', length: 100 })
    title: string;

    @Column('varchar', { name: 'projecttype', nullable: true, length: 45 })
    projectType: string;

    @Column('varchar', { name: 'specKeyPattern', nullable: true, length: 45 })
    speciesKeyPattern: string;

    @Column('varchar', { name: 'patternReplace', nullable: true, length: 45 })
    patternReplace: string;

    @Column('varchar', { name: 'replaceStr', nullable: true, length: 45 })
    replaceStr: string;

    @Column('varchar', { name: 'speckeyretrieval', nullable: true, length: 45 })
    speciesKeyRetrieval: string;

    @Column('int', { name: 'coordX1', nullable: true, unsigned: true })
    coordX1: number | null;

    @Column('int', { name: 'coordX2', nullable: true, unsigned: true })
    coordX2: number | null;

    @Column('int', { name: 'coordY1', nullable: true, unsigned: true })
    coordY1: number | null;

    @Column('int', { name: 'coordY2', nullable: true, unsigned: true })
    coordY2: number | null;

    @Column('varchar', { name: 'sourcePath', nullable: true, length: 250 })
    sourcePath: string;

    @Column('varchar', { name: 'targetPath', nullable: true, length: 250 })
    targetPath: string;

    @Column('varchar', { name: 'imgUrl', nullable: true, length: 250 })
    imgUrl: string;

    @Column('int', {
        name: 'webPixWidth',
        nullable: true,
        unsigned: true,
        default: () => '\'1200\'',
    })
    webPixWidth: number | null;

    @Column('int', {
        name: 'tnPixWidth',
        nullable: true,
        unsigned: true,
        default: () => '\'130\'',
    })
    thumbnailPixWidth: number | null;

    @Column('int', {
        name: 'lgPixWidth',
        nullable: true,
        unsigned: true,
        default: () => '\'2400\'',
    })
    largePixWidth: number | null;

    @Column('int', {
        name: 'jpgcompression',
        nullable: true,
        default: () => '\'70\'',
    })
    jpgCompression: number | null;

    @Column('int', {
        name: 'createTnImg',
        nullable: true,
        unsigned: true,
        default: () => '\'1\'',
    })
    createThumbnailImg: number | null;

    @Column('int', {
        name: 'createLgImg',
        nullable: true,
        unsigned: true,
        default: () => '\'1\'',
    })
    createLargeImg: number | null;

    @Column('varchar', { name: 'source', nullable: true, length: 45 })
    source: string;

    @Column('date', { name: 'lastrundate', nullable: true })
    lastRunDate: string;

    @Column('timestamp', {
        name: 'initialTimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.specimenProcessorProjects,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'collid'}])
    collection: Promise<Collection>;
}
