import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonomicAuthority } from './TaxonomicAuthority.entity';
import { Taxon } from './Taxon.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('usertaxonomy_UNIQUE', ['uid', 'taxonID', 'taxonAuthorityID', 'editorStatus'], {
    unique: true,
})
@Index(['uid'])
@Index(['taxonID'])
@Index(['taxonAuthorityID'])
@Entity('usertaxonomy')
export class UserTaxonomy extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'idusertaxonomy' })
    id: number;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('int', { name: 'taxauthid', unsigned: true, default: () => '\'1\'' })
    taxonAuthorityID: number;

    @Column('varchar', { name: 'editorstatus', nullable: true, length: 45 })
    editorStatus: string | null;

    @Column('varchar', { name: 'geographicScope', nullable: true, length: 250 })
    geographicScope: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'modifiedUid', unsigned: true })
    lastModifiedUID: number;

    @Column('datetime', { name: 'modifiedtimestamp', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => TaxonomicAuthority,
        (taxauthority) => taxauthority.userTaxonomies,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'taxauthid'}])
    taxonomicAuthority: Promise<TaxonomicAuthority>;

    @ManyToOne(() => Taxon, (taxa) => taxa.userTaxonomies, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'tid'}])
    taxon: Promise<Taxon>;

    @ManyToOne(() => User, (users) => users.userTaxonomies, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
