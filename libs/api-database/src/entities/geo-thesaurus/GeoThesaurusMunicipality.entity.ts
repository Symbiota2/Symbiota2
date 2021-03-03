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
@Entity('geothesmunicipality')
export class GeoThesaurusMunicipality extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'gtmid' })
    id: number;

    @Column('varchar', { name: 'municipalityterm', length: 45 })
    municipalityTerm: string;

    @Column('varchar', { name: 'abbreviation', nullable: true, length: 45 })
    abbreviation: string | null;

    @Column('varchar', { name: 'code', nullable: true, length: 45 })
    code: string | null;

    @Column('int', { name: 'lookupterm', default: () => '\'1\'' })
    lookupTerm: number;

    @Column('int', { name: 'acceptedid', nullable: true })
    acceptedID: number | null;

    @Column('int', { name: 'countyid', nullable: true })
    countyID: number | null;

    @Column('text', { name: 'footprintWKT', nullable: true })
    footprintWKT: string | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(
        () => GeoThesaurusMunicipality,
        (geothesmunicipality) => geothesmunicipality.otherNames,
        { onDelete: 'RESTRICT', onUpdate: 'RESTRICT' }
    )
    @JoinColumn([{ name: 'acceptedid' }])
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
    @JoinColumn([{ name: 'countyid' }])
    county: Promise<GeoThesaurusCounty>;
}
