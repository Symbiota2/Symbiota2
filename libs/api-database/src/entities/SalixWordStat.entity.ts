import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../entity-provider.class';

@Index('INDEX_unique', ['firstWord', 'secondWord'], { unique: true })
@Index('INDEX_secondword', ['secondWord'])
@Entity('salixwordstats')
export class SalixWordStat extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'swsid' })
    id: number;

    @Column('varchar', { name: 'firstword', length: 45 })
    firstWord: string;

    @Column('varchar', { name: 'secondword', nullable: true, length: 45 })
    secondWord: string | null;

    @Column('int', { name: 'locality', default: () => '\'0\'' })
    locality: number;

    @Column('int', { name: 'localityFreq', default: () => '\'0\'' })
    localityFrequency: number;

    @Column('int', { name: 'habitat', default: () => '\'0\'' })
    habitat: number;

    @Column('int', { name: 'habitatFreq', default: () => '\'0\'' })
    habitatFrequency: number;

    @Column('int', { name: 'substrate', default: () => '\'0\'' })
    substrate: number;

    @Column('int', { name: 'substrateFreq', default: () => '\'0\'' })
    substrateFrequency: number;

    @Column('int', { name: 'verbatimAttributes', default: () => '\'0\'' })
    verbatimAttributes: number;

    @Column('int', { name: 'verbatimAttributesFreq', default: () => '\'0\'' })
    verbatimAttributesFrequency: number;

    @Column('int', { name: 'occurrenceRemarks', default: () => '\'0\'' })
    occurrenceRemarks: number;

    @Column('int', { name: 'occurrenceRemarksFreq', default: () => '\'0\'' })
    occurrenceRemarksFrequency: number;

    @Column('int', { name: 'totalcount', default: () => '\'0\'' })
    totalCount: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;
}
