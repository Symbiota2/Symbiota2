import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/User.entity';
import { Image } from './Image.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['imageID'])
@Index(['assignedByUID'])
@Index('INDEX_imagekeyword', ['keyword'])
@Entity('imagekeywords')
export class ImageKeyword extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'imgkeywordid' })
    id: number;

    @Column('int', { name: 'imgid', unsigned: true })
    imageID: number;

    @Column('varchar', { name: 'keyword', length: 45 })
    keyword: string;

    @Column('int', { name: 'uidassignedby', nullable: true, unsigned: true })
    assignedByUID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(() => User, (users) => users.imageKeywords, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uidassignedby', referencedColumnName: 'uid' }])
    assignedBy: Promise<User>;

    @ManyToOne(() => Image, (images) => images.keywords, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Promise<Image>;
}
