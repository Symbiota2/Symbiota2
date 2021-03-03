import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { CharacterState } from './CharacterState.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('CSDescr', ['characteristicID', 'characterStateID'])
@Entity('kmdescr')
export class CharacteristicDescription extends EntityProvider {
    @Column('int', {
        primary: true,
        name: 'TID',
        unsigned: true,
        default: () => '\'0\'',
    })
    taxonID: number;

    @Column('int', {
        primary: true,
        name: 'CID',
        unsigned: true,
        default: () => '\'0\'',
    })
    characteristicID: number;

    @Column('varchar', { primary: true, name: 'CS', length: 16 })
    characterStateID: string;

    @Column('varchar', { name: 'Modifier', nullable: true, length: 255 })
    modifier: string;

    @Column('double', { name: 'X', nullable: true, precision: 15, scale: 5 })
    x: number | null;

    @Column('longtext', { name: 'TXT', nullable: true })
    txt: string;

    @Column('int', {
        name: 'PseudoTrait',
        nullable: true,
        unsigned: true,
        default: () => '\'0\'',
    })
    pseudoTrait: number | null;

    @Column('int', {
        name: 'Frequency',
        comment: 'Frequency of occurrence; 1 = rare... 5 = common',
        unsigned: true,
        default: () => '\'5\'',
    })
    frequency: number;

    @Column('varchar', { name: 'Inherited', nullable: true, length: 50 })
    inherited: string;

    @Column('varchar', { name: 'Source', nullable: true, length: 100 })
    source: string;

    @Column('int', { name: 'Seq', nullable: true })
    sequence: number | null;

    @Column('longtext', { name: 'Notes', nullable: true })
    notes: string;

    @Column('timestamp', {
        name: 'DateEntered',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => CharacterState, (kmcs) => kmcs.characteristicDescriptions, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([
        { name: 'CID', referencedColumnName: 'characteristicID'},
        { name: 'CS', referencedColumnName: 'characterState' },
    ])
    characterState: Promise<CharacterState>;

    @ManyToOne(() => Taxon, (taxa) => taxa.characteristicDescriptions, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'TID'}])
    taxon: Promise<Taxon>;
}
