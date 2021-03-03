import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CharacterStateLanguage } from './characteristic';
import { TaxonVernacular } from './taxonomy';
import { CharacteristicHeading } from './characteristic';
import { CharacteristicLanguage } from './characteristic';
import { TaxonDescriptionBlock } from './taxonomy';
import { EntityProvider } from '../entity-provider.class';

@Index('index_langname_unique', ['languageName'], { unique: true })
@Entity('adminlanguages')
export class AdminLanguage extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'langid' })
    id: number;

    @Column('varchar', { name: 'langname', unique: true, length: 45 })
    languageName: string;

    @Column('varchar', { name: 'iso639_1', nullable: true, length: 10 })
    iso6391: string;

    @Column('varchar', { name: 'iso639_2', nullable: true, length: 10 })
    iso6392: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 45 })
    notes: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => CharacterStateLanguage, (kmcslang) => kmcslang.adminLanguage)
    characterStateLanguages: Promise<CharacterStateLanguage[]>;

    @OneToMany(() => TaxonVernacular, (taxavernaculars) => taxavernaculars.adminLanguage)
    taxonVernaculars: Promise<TaxonVernacular[]>;

    @OneToMany(() => CharacteristicHeading, (kmcharheading) => kmcharheading.adminLanguage)
    characterHeadings: Promise<CharacteristicHeading[]>;

    @OneToMany(() => CharacteristicLanguage, (kmcharacterlang) => kmcharacterlang.adminLanguage)
    kmCharacterLangs: Promise<CharacteristicLanguage[]>;

    @OneToMany(() => TaxonDescriptionBlock, (taxadescrblock) => taxadescrblock.adminLanguage)
    taxaDescBlocks: Promise<TaxonDescriptionBlock[]>;
}
