import { Column, Entity, Index } from 'typeorm';
import { EntityProvider } from '../../entity-provider.class';

@Index('Index_ocr_imgid', ['imageID'])
@Index('Index_ocr_fulltext', ['rawStr'], { fulltext: true })
@Entity('specprocessorrawlabelsfulltext')
export class SpeciesProcessorRawLabelsFullText extends EntityProvider {
    @Column('int', { primary: true, name: 'prlid' })
    id: number;

    @Column('int', { name: 'imgid' })
    imageID: number;

    @Column('text', { name: 'rawstr' })
    rawStr: string;
}
