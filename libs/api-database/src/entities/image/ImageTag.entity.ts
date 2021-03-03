import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Image } from './Image.entity';
import { ImageTagKey } from './ImageTagKey.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('imgid', ['imageID', 'keyValue'], { unique: true })
@Index('keyvalue', ['keyValue'])
@Index(['imageID'])
@Entity('imagetag')
export class ImageTag extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'imagetagid' })
    id: string;

    @Column('int', { name: 'imgid', unsigned: true })
    imageID: number;

    @Column('varchar', { name: 'keyvalue', length: 30 })
    keyValueStr: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Image, (images) => images.tags, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Promise<Image>;

    @ManyToOne(() => ImageTagKey, (imagetagkey) => imagetagkey.tags, {
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'keyvalue'}])
    keyValue: Promise<ImageTagKey>;
}
