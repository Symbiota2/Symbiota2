import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { TraitState } from './TraitState.entity';
import { Trait } from './Trait.entity';
import { EntityProvider } from '../../entity-provider.class';

@Index(['traitID'])
@Index(['parentStateID'])
@Entity('tmtraitdependencies')
export class TraitDependency extends EntityProvider {
    @Column('int', { primary: true, name: 'traitid', unsigned: true })
    traitID: number;

    @Column('int', { primary: true, name: 'parentstateid', unsigned: true })
    parentStateID: number;

    @Column('timestamp', {
        name: 'initialtimestamp',
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP()',
    })
    initialTimestamp: Date | null;

    @ManyToOne(() => TraitState, (tmstates) => tmstates.dependencies, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'parentstateid'}])
    parentState: Promise<TraitState>;

    @ManyToOne(() => Trait, (tmtraits) => tmtraits.dependencies, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'traitid'}])
    trait: Promise<Trait>;
}
