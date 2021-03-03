import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TraitAttribute } from './TraitAttribute.entity';
import { Trait } from './Trait.entity';
import { User } from '../user/User.entity';
import { TraitDependency } from './TraitDependency.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('traitid_code_UNIQUE', ['traitID', 'stateCode'], { unique: true })
@Index(['creatorUID'])
@Index(['lastModifiedUID'])
@Entity('tmstates')
export class TraitState extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'stateid', unsigned: true })
    id: number;

    @Column('int', { name: 'traitid', unsigned: true })
    traitID: number;

    @Column('varchar', { name: 'statecode', length: 2 })
    stateCode: string;

    @Column('varchar', { name: 'statename', length: 75 })
    stateName: string;

    @Column('varchar', { name: 'description', nullable: true, length: 250 })
    description: string | null;

    @Column('varchar', { name: 'refurl', nullable: true, length: 250 })
    referenceURL: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('int', { name: 'sortseq', nullable: true })
    sortSequence: number | null;

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

    @OneToMany(() => TraitAttribute, (tmattributes) => tmattributes.state)
    attributes: Promise<TraitAttribute[]>;

    @ManyToOne(() => Trait, (tmtraits) => tmtraits.states, {
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'traitid'}])
    trait: Promise<Trait>;

    @ManyToOne(() => User, (users) => users.createdTraitStates, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'createduid', referencedColumnName: 'uid' }])
    creator: Promise<User>;

    @ManyToOne(() => User, (users) => users.modifiedTraitStates, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'modifieduid', referencedColumnName: 'uid' }])
    lastModifier: Promise<User>;

    @OneToMany(
        () => TraitDependency,
        (tmtraitdependencies) => tmtraitdependencies.parentState
    )
    dependencies: Promise<TraitDependency[]>;
}
