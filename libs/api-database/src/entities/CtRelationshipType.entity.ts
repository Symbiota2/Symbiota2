import { Column, Entity, OneToMany } from 'typeorm';
import { AgentRelation } from './agent/AgentRelation.entity';
import { EntityProvider } from '../entity-provider.class';

@Entity('ctrelationshiptypes')
export class CtRelationshipType extends EntityProvider {
    @Column('varchar', { primary: true, name: 'relationship', length: 50 })
    relationship: string;

    @Column('varchar', { name: 'inverse', nullable: true, length: 50 })
    inverse: string | null;

    @Column('varchar', { name: 'collective', nullable: true, length: 50 })
    collective: string | null;

    @OneToMany(
        () => AgentRelation,
        (agentrelations) => agentrelations.relationship
    )
    agentRelations: Promise<AgentRelation[]>;
}
