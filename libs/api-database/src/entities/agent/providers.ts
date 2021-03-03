import { Agent } from './Agent.entity';
import { AgentFullText } from './AgentFullText.entity';
import { AgentLink } from './AgentLink.entity';
import { AgentName } from './AgentName.entity';
import { AgentNumberPattern } from './AgentNumberPattern.entity';
import { AgentRelation } from './AgentRelation.entity';
import { AgentTeam } from './AgentTeam.entity'

export const providers = [
    Agent.getProvider<Agent>(),
    AgentFullText.getProvider<AgentFullText>(),
    AgentLink.getProvider<AgentLink>(),
    AgentName.getProvider<AgentName>(),
    AgentNumberPattern.getProvider<AgentNumberPattern>(),
    AgentRelation.getProvider<AgentRelation>(),
    AgentTeam.getProvider<AgentTeam>()
];
