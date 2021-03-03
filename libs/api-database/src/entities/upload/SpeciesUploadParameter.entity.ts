import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SpeciesMapUpload } from './SpeciesMapUpload.entity';
import { Collection } from '../collection';
import { EntityProvider } from '../../entity-provider.class';

@Index(['collectionID'])
@Entity('uploadspecparameters')
export class SpeciesUploadParameter extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'uspid', unsigned: true })
    id: number;

    @Column('int', { name: 'CollID', unsigned: true })
    collectionID: number;

    @Column('int', {
        name: 'UploadType',
        comment: '1 = Direct; 2 = DiGIR; 3 = File',
        unsigned: true,
        default: () => '\'1\'',
    })
    uploadType: number;

    @Column('varchar', { name: 'title', length: 45 })
    title: string;

    @Column('varchar', {
        name: 'Platform',
        nullable: true,
        comment: '1 = MySQL; 2 = MSSQL; 3 = ORACLE; 11 = MS Access; 12 = FileMaker',
        length: 45,
        default: () => '\'1\'',
    })
    platform: string;

    @Column('varchar', { name: 'server', nullable: true, length: 150 })
    server: string;

    @Column('int', { name: 'port', nullable: true, unsigned: true })
    port: number | null;

    @Column('varchar', { name: 'driver', nullable: true, length: 45 })
    driver: string;

    @Column('varchar', { name: 'Code', nullable: true, length: 45 })
    code: string;

    @Column('varchar', { name: 'Path', nullable: true, length: 150 })
    path: string;

    @Column('varchar', { name: 'PkField', nullable: true, length: 45 })
    primaryKeyField: string;

    @Column('varchar', { name: 'Username', nullable: true, length: 45 })
    username: string;

    @Column('varchar', { name: 'Password', nullable: true, length: 45 })
    password: string;

    @Column('varchar', { name: 'SchemaName', nullable: true, length: 150 })
    schemaName: string;

    @Column('varchar', { name: 'QueryStr', nullable: true, length: 2000 })
    queryStr: string;

    // TODO: Better name
    @Column('varchar', { name: 'cleanupsp', nullable: true, length: 45 })
    cleanupSpecies: string;

    // TODO: What's this?
    @Column('int', {
        name: 'dlmisvalid',
        nullable: true,
        unsigned: true,
        default: () => '\'0\'',
    })
    dlmIsValid: number | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => SpeciesMapUpload, (uploadspecmap) => uploadspecmap.uploadParameters)
    speciesMaps: Promise<SpeciesMapUpload[]>;

    @ManyToOne(
        () => Collection,
        (omcollections) => omcollections.speciesUploadParameters,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'CollID'}])
    collection: Promise<Collection>;
}
