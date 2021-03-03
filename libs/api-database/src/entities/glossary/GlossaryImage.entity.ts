import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Glossary } from './Glossary.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['glossaryID'])
@Index(['uid'])
@Entity('glossaryimages')
export class GlossaryImage extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'glimgid', unsigned: true })
    id: number;

    @Column('int', { name: 'glossid', unsigned: true })
    glossaryID: number;

    @Column('varchar', { name: 'url', length: 255 })
    url: string;

    @Column('varchar', { name: 'thumbnailurl', nullable: true, length: 255 })
    thumbnailUrl: string;

    @Column('varchar', { name: 'structures', nullable: true, length: 150 })
    structures: string;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string;

    @Column('varchar', { name: 'createdBy', nullable: true, length: 250 })
    createdBy: string;

    @Column('int', { name: 'uid', nullable: true, unsigned: true })
    uid: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Glossary, (glossary) => glossary.images, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'glossid'}])
    glossary: Promise<Glossary>;

    @ManyToOne(() => User, (users) => users.glossaryImages, {
        onDelete: 'SET NULL',
        onUpdate: 'SET NULL',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
