import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('term_index', ['term'])
@Index('relatedterm_index', ['newGroupID'])
@Entity('uploadglossary')
export class GlossaryUpload extends EntityProvider {
    @PrimaryGeneratedColumn({ name: 'id', unsigned: true })
    id: number;

    @Column('varchar', { name: 'term', nullable: true, length: 150 })
    term: string | null;

    @Column('varchar', { name: 'definition', nullable: true, length: 1000 })
    definition: string | null;

    @Column('varchar', { name: 'language', nullable: true, length: 45 })
    language: string | null;

    @Column('varchar', { name: 'source', nullable: true, length: 1000 })
    source: string | null;

    @Column('varchar', { name: 'author', nullable: true, length: 250 })
    author: string | null;

    @Column('varchar', { name: 'translator', nullable: true, length: 250 })
    translator: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('varchar', { name: 'resourceurl', nullable: true, length: 600 })
    resourceURL: string | null;

    @Column('varchar', { name: 'tidStr', nullable: true, length: 100 })
    taxonIDStr: string | null;

    @Column('tinyint', { name: 'synonym', nullable: true, width: 1 })
    synonym: boolean | null;

    @Column('int', { name: 'newGroupId', nullable: true })
    newGroupID: number | null;

    @Column('int', { name: 'currentGroupId', nullable: true })
    currentGroupID: number | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
