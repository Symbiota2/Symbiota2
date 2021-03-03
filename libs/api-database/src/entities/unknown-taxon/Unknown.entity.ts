import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Taxon } from '../taxonomy/Taxon.entity';
import { UnknownImage } from './UnknownImage.entity';
import { UnknownComment } from './UnknownComment.entity';
import { EntityProvider } from '../../entity-provider.class';
import { User } from '../user/User.entity';

@Index(['username'])
@Index(['taxonID'])
@Entity('unknowns')
export class Unknown extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'unkid', unsigned: true })
    id: number;

    @Column('int', { name: 'tid', nullable: true, unsigned: true })
    taxonID: number | null;

    @Column('varchar', { name: 'photographer', nullable: true, length: 100 })
    photographer: string | null;

    @Column('varchar', { name: 'owner', nullable: true, length: 100 })
    owner: string | null;

    @Column('varchar', { name: 'locality', nullable: true, length: 250 })
    locality: string | null;

    @Column('double', { name: 'latdecimal', nullable: true, precision: 22 })
    latitude: number | null;

    @Column('double', { name: 'longdecimal', nullable: true, precision: 22 })
    longitude: number | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('varchar', { name: 'username', length: 45 })
    username: string;

    @Column('varchar', {
        name: 'idstatus',
        length: 45,
        default: () => '\'ID pending\'',
    })
    idStatus: string;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(() => Taxon, (taxa) => taxa.unknowns, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => User, (userlogin) => userlogin.unknowns, {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    })
    @JoinColumn([{ name: 'username', referencedColumnName: 'username' }])
    user: Promise<User>;

    @OneToMany(() => UnknownImage, (unknownimages) => unknownimages.unknown)
    images: Promise<UnknownImage[]>;

    @OneToMany(() => UnknownComment, (unknowncomments) => unknowncomments.unknown)
    comments: Promise<UnknownComment[]>;
}
