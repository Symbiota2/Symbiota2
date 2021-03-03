import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacteristicHeading } from './CharacteristicHeading.entity';
import { CharacteristicLanguage } from './CharacteristicLanguage.entity';
import { CharacterState } from './CharacterState.entity';
import { CharacteristicTaxonLink } from './CharacteristicTaxonLink.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_charname', ['name'])
@Index('Index_sort', ['sortSequence'])
@Index(['headingID'])
@Entity('kmcharacters')
export class Characteristic extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'cid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'charname', length: 150 })
    name: string;

    @Column('varchar', { name: 'chartype', length: 2, default: () => '\'UM\'' })
    type: string;

    @Column('varchar', {
        name: 'defaultlang',
        length: 45,
        default: () => '\'English\'',
    })
    defaultLanguage: string;

    @Column('smallint', {
        name: 'difficultyrank',
        unsigned: true,
        default: () => '\'1\'',
    })
    difficultyRank: number;

    @Column('int', { name: 'hid', nullable: true, unsigned: true })
    headingID: number | null;

    @Column('varchar', { name: 'units', nullable: true, length: 45 })
    units: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 255 })
    description: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('varchar', { name: 'helpurl', nullable: true, length: 500 })
    helpUrl: string | null;

    @Column('varchar', { name: 'enteredby', nullable: true, length: 45 })
    enteredBy: string | null;

    @Column('int', { name: 'sortsequence', nullable: true, unsigned: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => CharacteristicHeading,
        (kmcharheading) => kmcharheading.characteristics,
        { onDelete: 'RESTRICT', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'hid', referencedColumnName: 'id' }])
    heading: Promise<CharacteristicHeading>;

    @OneToMany(() => CharacteristicLanguage, (kmcharacterlang) => kmcharacterlang.characteristic)
    characteristicLanguages: Promise<CharacteristicLanguage[]>;

    @OneToMany(() => CharacterState, (kmcs) => kmcs.characteristic)
    characterStates: Promise<CharacterState[]>;

    @OneToMany(() => CharacteristicTaxonLink, (kmchartaxalink) => kmchartaxalink.characteristic)
    characteristicTaxonLinks: Promise<CharacteristicTaxonLink[]>;
}
