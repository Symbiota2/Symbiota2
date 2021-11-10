import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('UNIQUE_taxonunits', ['kingdomName', 'rankID'], { unique: true })
@Index(['rankID'])
@Entity('taxonunits')
export class TaxonomicUnit extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'taxonunitid' })
    id: number;

    @Column('varchar', {
        name: 'kingdomName',
        length: 45,
        default: () => '\'Organism\'',
    })
    kingdomName: string;

    @Column('smallint', {
        name: 'rankid',
        unsigned: true,
        default: () => '\'0\''
    })
    rankID: number;

    @Column('varchar', { name: 'rankname' })
    rankName: string;

    @Column('varchar', { name: 'suffix', nullable: true, length: 45 })
    suffix: string;

    @Column('smallint', { name: 'dirparentrankid' })
    directParentRankID: number;

    // TODO: What is this?
    @Column('smallint', { name: 'reqparentrankid', nullable: true })
    reqParentRankID: number | null;

    @Column('varchar', { name: 'modifiedby', nullable: true, length: 45 })
    lastModifiedBy: string;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
