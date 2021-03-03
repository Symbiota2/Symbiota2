import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Characteristic } from './Characteristic.entity';
import { AdminLanguage } from '../AdminLanguage.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['adminLanguageID'])
@Entity('kmcharacterlang')
export class CharacteristicLanguage extends EntityProvider {
    @Column('int', { primary: true, name: 'cid', unsigned: true })
    characteristicID: number;

    @Column('varchar', { name: 'charname', length: 150 })
    characteristicName: string;

    @Column('varchar', { name: 'language', length: 45 })
    language: string;

    @Column('int', { primary: true, name: 'langid' })
    adminLanguageID: number;

    @Column('varchar', { name: 'notes', nullable: true, length: 255 })
    notes: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 255 })
    description: string | null;

    @Column('varchar', { name: 'helpurl', nullable: true, length: 500 })
    helpUrl: string | null;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Characteristic,
        (kmcharacters) => kmcharacters.characteristicLanguages,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'cid'}])
    characteristic: Promise<Characteristic>;

    @ManyToOne(
        () => AdminLanguage,
        (adminlanguages) => adminlanguages.kmCharacterLangs,
        { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }
    )
    @JoinColumn([{ name: 'langid'}])
    adminLanguage: Promise<AdminLanguage>;
}
