import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { CharacterStateLanguage } from './CharacterStateLanguage.entity';
import { CharacteristicDescription } from './CharacteristicDescription.entity';
import { CharacteristicDependence } from './CharacteristicDependence.entity';
import { CharacterStateImage } from './CharacterStateImage.entity';
import { Characteristic } from './Characteristic.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['characteristicID'])
@Entity('kmcs')
export class CharacterState extends EntityProvider {
    // TODO: Better composite key naming
    @Column('int', {
        primary: true,
        name: 'cid',
        unsigned: true,
        default: () => '\'0\'',
    })
    characteristicID: number;

    @Column('varchar', { primary: true, name: 'cs', length: 16 })
    characterState: string;

    @Column('varchar', { name: 'CharStateName', nullable: true, length: 255 })
    characterStateName: string | null;

    @Column('tinyint', { name: 'Implicit', width: 1, default: () => '\'0\'' })
    implicit: number;

    @Column('longtext', { name: 'Notes', nullable: true })
    notes: string | null;

    @Column('varchar', { name: 'Description', nullable: true, length: 255 })
    description: string | null;

    @Column('varchar', { name: 'IllustrationUrl', nullable: true, length: 250 })
    illustrationUrl: string | null;

    @Column('int', { name: 'StateID', nullable: true, unsigned: true })
    stateID: number | null;

    @Column('int', { name: 'SortSequence', nullable: true, unsigned: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @Column('varchar', { name: 'EnteredBy', nullable: true, length: 45 })
    enteredBy: string | null;

    @OneToMany(() => CharacterStateLanguage, (kmcslang) => kmcslang.characterState)
    characterStateLanguages: Promise<CharacterStateLanguage[]>;

    // TODO: Better naming
    @OneToMany(() => CharacteristicDescription, (kmdescr) => kmdescr.characterState)
    characteristicDescriptions: Promise<CharacteristicDescription[]>;

    @OneToMany(
        () => CharacteristicDependence,
        (kmchardependance) => kmchardependance.characterState
    )
    characteristicDependencies: Promise<CharacteristicDependence[]>;

    @OneToMany(() => CharacterStateImage, (kmcsimages) => kmcsimages.characterState)
    characterStateImages: Promise<CharacterStateImage[]>;

    @ManyToOne(() => Characteristic, (kmcharacters) => kmcharacters.characterStates, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'cid'}])
    characteristic: Promise<Characteristic>;
}
