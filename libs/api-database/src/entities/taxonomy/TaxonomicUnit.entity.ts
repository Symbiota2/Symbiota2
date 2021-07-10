import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index(['kingdomName', 'rankID'], { unique: true })
@Entity()
export class TaxonomicUnit extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', {
        length: 45,
        default: () => '\'Organism\'',
    })
    kingdomName: string;

    @Column('smallint', { unsigned: true, default: () => "'0'" })
    rankID: number;

    @Column('varchar')
    rankName: string;

    @Column('varchar', { nullable: true, length: 45 })
    suffix: string;

    @Column('smallint')
    directParentRankID: number;

    // TODO: What is this?
    @Column('smallint', { nullable: true })
    reqParentRankID: number | null;

    @Column('varchar', { nullable: true, length: 45 })
    lastModifiedBy: string;

    @Column('datetime', { nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;
}
