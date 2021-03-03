import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Occurrence } from './Occurrence.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('guid_UNIQUE', ['guid'], { unique: true })
@Index(['uid'])
@Index(['occurrenceID'])
@Entity('omoccuredits')
export class OccurrenceEdit extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'ocedid' })
    id: number;

    @Column('int', { name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'FieldName', length: 45 })
    fieldName: string;

    @Column('text', { name: 'FieldValueNew' })
    fieldValueNew: string;

    @Column('text', { name: 'FieldValueOld' })
    fieldValueOld: string;

    @Column('int', {
        name: 'ReviewStatus',
        comment: '1=Open;2=Pending;3=Closed',
        default: () => '\'1\'',
    })
    reviewStatus: number;

    @Column('int', {
        name: 'AppliedStatus',
        comment: '0=Not Applied;1=Applied',
        default: () => '\'0\'',
    })
    appliedStatus: number;

    @Column('varchar', {
        name: 'guid',
        nullable: true,
        unique: true,
        length: 45
    })
    guid: string | null;

    @Column('int', { name: 'uid', unsigned: true })
    uid: number;

    @Column(
        'tinyint',
        {
            name: 'editType',
            unsigned: true,
            default: 0,
            comment: '0 = general edit, 1 = batch edit'
        }
    )
    editType: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.edits,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => User, (users) => users.occurrenceEdits, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'uid', referencedColumnName: 'uid' }])
    user: Promise<User>;
}
