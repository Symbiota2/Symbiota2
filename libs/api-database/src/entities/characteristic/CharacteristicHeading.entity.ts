import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Characteristic } from './Characteristic.entity';
import { AdminLanguage } from '../AdminLanguage.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('unique_kmcharheading', ['name', 'adminLanguageID'], { unique: true })
@Index('HeadingName', ['name'])
@Index(['adminLanguageID'])
@Entity('kmcharheading')
export class CharacteristicHeading extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'hid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'headingname', length: 255 })
    name: string;

    @Column('varchar', {
        name: 'language',
        length: 45,
        default: () => '\'English\'',
    })
    language: string;

    @Column('int', { primary: true, name: 'langid' })
    adminLanguageID: number;

    @Column('longtext', { name: 'notes', nullable: true })
    notes: string | null;

    @Column('int', { name: 'sortsequence', nullable: true })
    sortSequence: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => Characteristic, (kmcharacters) => kmcharacters.heading)
    characteristics: Promise<Characteristic[]>;

    @ManyToOne(
        () => AdminLanguage,
        (adminlanguages) => adminlanguages.characterHeadings,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'langid'}])
    adminLanguage: Promise<AdminLanguage>;
}
