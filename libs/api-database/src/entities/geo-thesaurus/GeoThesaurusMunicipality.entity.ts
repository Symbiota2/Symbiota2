import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { GeoThesaurusCounty } from './GeoThesaurusCounty.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['countyID'])
@Index(['acceptedID'])
@Entity()
export class GeoThesaurusMunicipality extends EntityProvider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { length: 45 })
    municipalityTerm: string;

    @Column('varchar', { nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { nullable: true, length: 45 })
    code: string | null;

    @Column('int', { default: () => "'1'" })
    lookupTerm: number;

    @Column('int', { nullable: true })
    acceptedID: number | null;

    @Column('int', { nullable: true })
    countyID: number | null;

    @Column('text', { nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP()' })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => GeoThesaurusMunicipality,
        (geothesmunicipality) => geothesmunicipality.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedID' }])
    acceptedName: Promise<GeoThesaurusMunicipality>;

    @OneToMany(
        () => GeoThesaurusMunicipality,
        (geothesmunicipality) => geothesmunicipality.acceptedName
    )
    otherNames: Promise<GeoThesaurusMunicipality[]>;

    @ManyToOne(
        () => GeoThesaurusCounty,
        (geothescounty) => geothescounty.municipalities,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'countyID' }])
    county: Promise<GeoThesaurusCounty>;
}
