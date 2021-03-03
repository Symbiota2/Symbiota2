import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_uploadimg_occid', ['occurrenceID'])
@Index('Index_uploadimg_collid', ['collectionID'])
@Index('Index_uploadimg_dbpk', ['dbpk'])
@Index('Index_uploadimg_ts', ['initialTimestamp'])
@Entity('uploadimagetemp')
export class ImageTempUpload extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('varchar', { name: 'url', length: 255 })
    url: string;

    @Column('varchar', { name: 'thumbnailurl', nullable: true, length: 255 })
    thumbnailURL: string | null;

    @Column('varchar', { name: 'originalurl', nullable: true, length: 255 })
    originalURL: string | null;

    @Column('varchar', { name: 'archiveurl', nullable: true, length: 255 })
    archiveURL: string | null;

    @Column('varchar', { name: 'photographer', nullable: true, length: 100 })
    photographer: string | null;

    @Column('int', { name: 'photographeruid', nullable: true, unsigned: true })
    photographerUID: number | null;

    @Column('varchar', { name: 'imagetype', nullable: true, length: 50 })
    imageType: string | null;

    @Column('varchar', { name: 'format', nullable: true, length: 45 })
    format: string | null;

    @Column('varchar', { name: 'caption', nullable: true, length: 100 })
    caption: string | null;

    @Column('varchar', { name: 'owner', nullable: true, length: 100 })
    owner: string | null;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('int', { name: 'collid', nullable: true, unsigned: true })
    collectionID: number | null;

    // TODO: Better name
    @Column('varchar', { name: 'dbpk', nullable: true, length: 150 })
    dbpk: string | null;

    @Column('varchar', { name: 'specimengui', nullable: true, length: 45 })
    specimenGUI: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('varchar', { name: 'username', nullable: true, length: 45 })
    username: string | null;

    @Column('int', { name: 'sortsequence', nullable: true, unsigned: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
