import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Image } from '../image/Image.entity';
import { Occurrence } from '../occurrence/Occurrence.entity';
import { TraitState } from './TraitState.entity';
import { User } from '../user/User.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['traitStateID'])
@Index(['occurrenceID'])
@Index(['imageID'])
@Index(['creatorUID'])
@Index(['lastModifiedUID'])
@Entity('tmattributes')
export class TraitAttribute extends EntityProvider {
    @Column('int', { primary: true, name: 'stateid', unsigned: true })
    traitStateID: number;

    @Column('int', { primary: true, name: 'occid', unsigned: true })
    occurrenceID: number;

    @Column('varchar', { name: 'modifier', nullable: true, length: 100 })
    modifier: string | null;

    @Column('double', {
        name: 'xvalue',
        nullable: true,
        precision: 15,
        scale: 5
    })
    xvalue: number | null;

    @Column('int', { name: 'imgid', nullable: true, unsigned: true })
    imageID: number | null;

    @Column('varchar', { name: 'imagecoordinates', nullable: true, length: 45 })
    imageCoordinates: string | null;

    @Column('varchar', { name: 'source', nullable: true, length: 250 })
    source: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('tinyint', { name: 'statuscode', nullable: true })
    statusCode: number | null;

    @Column('int', { name: 'modifieduid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('int', { name: 'createduid', nullable: true, unsigned: true })
    creatorUID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(() => Image, (images) => images.traitAttributes, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'imgid'}])
    image: Promise<Image>;

    @ManyToOne(
        () => Occurrence,
        (omoccurrences) => omoccurrences.tmattributes,
        { onDelete: 'CASCADE', onUpdate: 'CASCADE' }
    )
    @JoinColumn([{ name: 'occid'}])
    occurrence: Promise<Occurrence>;

    @ManyToOne(() => TraitState, (tmstates) => tmstates.attributes, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'stateid'}])
    state: Promise<TraitState>;

    @ManyToOne(() => User, (users) => users.createdTraitAttributes, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'createduid', referencedColumnName: 'uid' }])
    creator: Promise<User>;

    @ManyToOne(() => User, (users) => users.modifiedTraitAttributes, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'modifieduid', referencedColumnName: 'uid' }])
    lastModifier: Promise<User>;
}
