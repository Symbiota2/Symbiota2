
import { CrowdSourceCentral } from './CrowdSourceCentral.entity';
import { CrowdSourceQueue } from './CrowdSourceQueue.entity'
        
export const providers = [
    CrowdSourceCentral.getProvider<CrowdSourceCentral>(),
    CrowdSourceQueue.getProvider<CrowdSourceQueue>()
];
