import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ExsiccatiNumber } from './ExsiccatiNumber.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('index_exsiccatiTitle', ['title'])
@Entity('omexsiccatititles')
export class ExsiccatiTitle extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ometid', unsigned: true })
    exsiccatiTaxonID: number;

    @Column('varchar', { name: 'title', length: 150 })
    title: string;

    @Column('varchar', { name: 'abbreviation', nullable: true, length: 100 })
    abbreviation: string | null;

    @Column('varchar', { name: 'editor', nullable: true, length: 150 })
    editor: string | null;

    @Column('varchar', { name: 'exsrange', nullable: true, length: 45 })
    exsiccatiRange: string | null;

    @Column('varchar', { name: 'startdate', nullable: true, length: 45 })
    startDate: string | null;

    @Column('varchar', { name: 'enddate', nullable: true, length: 45 })
    endDate: string | null;

    @Column('varchar', { name: 'source', nullable: true, length: 250 })
    source: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 2000 })
    notes: string | null;

    @Column('varchar', { name: 'lasteditedby', nullable: true, length: 45 })
    lastEditedBy: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(
        () => ExsiccatiNumber,
        (omexsiccatinumbers) => omexsiccatinumbers.exsiccatiTitle
    )
    exsiccatiNumbers: Promise<ExsiccatiNumber[]>;
}
