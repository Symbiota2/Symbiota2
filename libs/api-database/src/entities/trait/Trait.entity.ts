import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { TraitState } from './TraitState.entity';
import { TraitTaxonLink } from './TraitTaxonLink.entity';
import { User } from '../user/User.entity';
import { TraitDependency } from './TraitDependency.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index('traitsname', ['name'])
@Index(['creatorUID'])
@Index(['lastModifiedUID'])
@Entity('tmtraits')
export class Trait extends EntityProvider {
    @PrimaryGeneratedColumn({ type: 'int', name: 'traitid', unsigned: true })
    id: number;

    @Column('varchar', { name: 'traitname', length: 100 })
    name: string;

    @Column('varchar', { name: 'traittype', length: 2, default: () => '\'UM\'' })
    type: string;

    @Column('varchar', { name: 'units', nullable: true, length: 45 })
    units: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 250 })
    description: string | null;

    @Column('varchar', { name: 'refurl', nullable: true, length: 250 })
    referenceURL: string | null;

    @Column('varchar', { name: 'notes', nullable: true, length: 250 })
    notes: string | null;

    @Column('text', { name: 'dynamicProperties', nullable: true })
    dynamicProperties: string | null;

    @Column('int', { name: 'modifieduid', nullable: true, unsigned: true })
    lastModifiedUID: number | null;

    @Column('datetime', { name: 'datelastmodified', nullable: true })
    lastModifiedTimestamp: Date | null;

    @Column('int', { name: 'createduid', nullable: true, unsigned: true })
    creatorUID: number | null;

    @Column('timestamp', {
        name: 'initialtimestamp',
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date;

    @OneToMany(() => TraitState, (tmstates) => tmstates.trait)
    states: Promise<TraitState[]>;

    @OneToMany(() => TraitTaxonLink, (tmtraittaxalink) => tmtraittaxalink.trait)
    taxonLinks: Promise<TraitTaxonLink[]>;

    @ManyToOne(() => User, (users) => users.createdTraits, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'createduid', referencedColumnName: 'uid' }])
    creator: Promise<User>;

    @ManyToOne(() => User, (users) => users.modifiedTraits, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'modifieduid', referencedColumnName: 'uid' }])
    lastModifier: Promise<User>;

    @OneToMany(
        () => TraitDependency,
        (tmtraitdependencies) => tmtraitdependencies.trait
    )
    dependencies: Promise<TraitDependency[]>;
}
