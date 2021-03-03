import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Characteristic } from './Characteristic.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['taxonID'])
@Entity('kmchartaxalink')
export class CharacteristicTaxonLink extends EntityProvider {
    @Column('int', {
        primary: true,
        name: 'CID',
        unsigned: true,
        default: () => '\'0\'',
    })
    characteristicID: number;

    @Column('int', {
        primary: true,
        name: 'TID',
        unsigned: true,
        default: () => '\'0\'',
    })
    taxonID: number;

    @Column('varchar', { name: 'Status', nullable: true, length: 50 })
    status: string | null;

    @Column('varchar', { name: 'Notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('varchar', {
        name: 'Relation',
        length: 45,
        default: () => '\'include\'',
    })
    relation: string;

    @Column('bit', { name: 'EditabilityInherited', nullable: true })
    editabilityInherited: number | null;

    @Column('timestamp', {
        name: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Characteristic,
        (kmcharacters) => kmcharacters.characteristicTaxonLinks,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'CID'}])
    characteristic: Promise<Characteristic>;

    @ManyToOne(() => Taxon, (taxa) => taxa.characteristicLinks, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'TID'}])
    taxon: Promise<Taxon>;
}
