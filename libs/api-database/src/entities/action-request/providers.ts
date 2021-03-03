
import { ActionRequest } from './ActionRequest.entity';
import { ActionRequestType } from './ActionRequestType.entity'
        
export const providers = [
    ActionRequest.getProvider<ActionRequest>(),
    ActionRequestType.getProvider<ActionRequestType>()
];
