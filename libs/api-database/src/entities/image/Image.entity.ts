import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TraitAttribute } from '../trait/TraitAttribute.entity';
import { ImageProjectLink } from './ImageProjectLink.entity';
import { ImageKeyword } from './ImageKeyword.entity';
import { TaxonProfilePublicationImageLink } from '../taxonomy/TaxonProfilePublicationImageLink.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { User } from '../user/User.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { SpeciesProcessorRawLabel } from '../species-processor/SpeciesProcessorRawLabel.entity';
import { ImageTag } from './ImageTag.entity';
import { ImageAnnotation } from './ImageAnnotation.entity';
import { EntityProvider } from '../../entity-provider.class';
import { DwCField, DwCRecord, dwcRecordType } from '@symbiota2/dwc';

@Index('Index_tid', ['taxonID'])
@Index(['occurrenceID'])
@Index(['photographerUID'])
@Index(['initialTimestamp'])
@DwCRecord('http://purl.org/dc/dcmitype/Image')
@Entity('images')
export class Image extends EntityProvider {
    static get DWC_TYPE(): string {
        return dwcRecordType(Image);
    }

    @PrimaryGeneratedColumn({ type: 'int', name: 'imgid', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('varchar', { name: 'url', length: 255 })
    url: string;

    @Column('varchar', { name: 'thumbnailurl', nullable: true, length: 255 })
    thumbnailUrl: string;

    @Column('varchar', { name: 'originalurl', nullable: true, length: 255 })
    originalUrl: string;

    @Column('varchar', { name: 'archiveurl', nullable: true, length: 255 })
    archiveUrl: string;

    @Column('varchar', { name: 'photographer', nullable: true, length: 100 })
    @DwCField('http://purl.org/dc/terms/creator')
    photographerName: string;

    @Column('int', { name: 'photographeruid', nullable: true, unsigned: true })
    photographerUID: number | null;

    @Column('varchar', { name: 'imagetype', nullable: true, length: 50 })
    type: string;

    @Column('varchar', { name: 'format', nullable: true, length: 45 })
    format: string;

    @Column('varchar', { name: 'caption', nullable: true, length: 100 })
    @DwCField('http://purl.org/dc/terms/description')
    caption: string;

    @Column('varchar', { name: 'owner', nullable: true, length: 250 })
    owner: string;

    @Column('varchar', { name: 'sourceurl', nullable: true, length: 255 })
    @DwCField('http://purl.org/dc/terms/identifier')
    sourceUrl: string;

    @Column('varchar', { name: 'referenceUrl', nullable: true, length: 255 })
    referenceUrl: string;

    @Column('varchar', { name: 'copyright', nullable: true, length: 255 })
    copyright: string;

    @Column('varchar', { name: 'rights', nullable: true, length: 255 })
    @DwCField('http://purl.org/dc/terms/rights')
    rights: string;

    @Column('varchar', { name: 'accessrights', nullable: true, length: 255 })
    @DwCField('http://purl.org/dc/terms/accessRights')
    accessRights: string;

    @Column('varchar', { name: 'locality', nullable: true, length: 250 })
    locality: string;

    @Column('int', { name: 'occid', nullable: true, unsigned: true })
    occurrenceID: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 350 })
    notes: string;

    @Column('varchar', { name: 'anatomy', nullable: true, length: 100 })
    anatomy: string;

    @Column('varchar', { name: 'username', nullable: true, length: 45 })
    username: string;

    @Column('varchar', {
        name: 'sourceIdentifier',
        nullable: true,
        length: 150
    })
    sourceIdentifier: string;

    @Column('varchar', { name: 'mediaMD5', nullable: true, length: 45 })
    mediaMD5: string;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string;

    @Column('int', {
        name: 'sortsequence',
        unsigned: true,
        default: () => '\'50\'',
    })
    sortSequence: number;

    @Column('timestamp', {
        name: 'InitialTimeStamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    @DwCField('http://purl.org/dc/terms/created')
    initialTimestamp: Date;

    @OneToMany(() => TraitAttribute, (tmattributes) => tmattributes.image)
    traitAttributes: Promise<TraitAttribute[]>;

    @OneToMany(() => ImageProjectLink, (imageprojectlink) => imageprojectlink.image)
    projectLinks: Promise<ImageProjectLink[]>;

    @OneToMany(() => ImageKeyword, (imagekeywords) => imagekeywords.image)
    keywords: Promise<ImageKeyword[]>;

    @OneToMany(
        () => TaxonProfilePublicationImageLink,
        (taxaprofilepubimagelink) => taxaprofilepubimagelink.image
    )
    pubImageLinks: Promise<TaxonProfilePublicationImageLink[]>;

    @ManyToOne(() => Occurrence, (omoccurrences) => omoccurrences.images, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => User, (users) => users.images, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'photographeruid', referencedColumnName: 'uid' }])
    photographer: Promise<User>;

    @ManyToOne(() => Taxon, (taxa) => taxa.images, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @OneToMany(
        () => SpeciesProcessorRawLabel,
        (specprocessorrawlabels) => specprocessorrawlabels.image
    )
    specProcessorRawLabels: Promise<SpeciesProcessorRawLabel[]>;

    @OneToMany(() => ImageTag, (imagetag) => imagetag.image)
    tags: Promise<ImageTag[]>;

    @OneToMany(() => ImageAnnotation, (imageannotations) => imageannotations.image)
    annotations: Promise<ImageAnnotation[]>;
}
