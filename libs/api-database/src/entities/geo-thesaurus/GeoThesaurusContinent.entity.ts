import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GeoThesaurusCountry } from './GeoThesaurusCountry.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['acceptedID'])
@Entity()
export class GeoThesaurusContinent extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column('varchar', { length: 45 })
    name: string;

    @Column('varchar', { nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('int', { nullable: true })
    acceptedID: number | null;

    @Column('longtext', { nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @OneToMany(() => GeoThesaurusCountry, (geothescountry) => geothescountry.continent)
    countries: Promise<GeoThesaurusCountry[]>;

    @ManyToOne(
        () => GeoThesaurusContinent,
        (geothescontinent) => geothescontinent.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedID' }])
    acceptedName: Promise<GeoThesaurusContinent>;

    @OneToMany(
        () => GeoThesaurusContinent,
        (geothescontinent) => geothescontinent.acceptedName
    )
    otherNames: Promise<GeoThesaurusContinent[]>;
}
