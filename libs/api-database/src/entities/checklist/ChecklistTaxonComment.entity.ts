import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChecklistTaxonLink } from './ChecklistTaxonLink.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['uid'])
@Index(['checklistID', 'taxonID'])
@Entity('fmcltaxacomments')
export class ChecklistTaxonComment extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'cltaxacommentsid' })
    id: number;

    @Column('int', { name: 'clid', unsigned: true })
    checklistID: number;

    @Column('int', { name: 'tid', unsigned: true })
    taxonID: number;

    @Column('text', { name: 'comment' })
    comment: string;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    @Column('int', { name: 'ispublic', default: () => '\'1\'' })
    isPublic: number;

    @Column('int', { name: 'parentid', nullable: true })
    parentID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => ChecklistTaxonLink,
        (fmchklsttaxalink) => fmchklsttaxalink.taxonComments,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([
        { name: 'clid', 'referencedColumnName': 'checklistID' },
        { name: 'tid', 'referencedColumnName': 'taxonID' },
    ])
    checklistTaxonLink: Promise<ChecklistTaxonLink>;

    @ManyToOne(() => User, (users) => users.checklistTaxonComments, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    commenter: Promise<User>;
}
