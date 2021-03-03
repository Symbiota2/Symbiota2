import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Image } from './Image.entity';
import { Taxon } from '../taxonomy/Taxon.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('TID', ['taxonID'])
@Entity('imageannotations')
export class ImageAnnotation extends EntityProvider {
    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('int', {
        primary: true,
        name: 'imgid',
        unsigned: true,
        default: () => '\'0\'',
    })
    imageID: number;

    @Column('datetime', {
        primary: true,
        name: 'AnnDate',
        default: () => '\'0000-00-00 00:00:00\'',
    })
    annotationDate: Date;

    @Column('varchar', { name: 'Annotator', nullable: true, length: 100 })
    annotator: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Image, (images) => images.annotations, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Promise<Image>;

    @ManyToOne(() => Taxon, (taxa) => taxa.imageAnnotations, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;
}
