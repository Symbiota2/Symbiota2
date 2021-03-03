
import { ConfigPage } from './ConfigPage.entity';
import { ConfigPageAttribute } from './ConfigPageAttribute.entity'
        
export const providers = [
    ConfigPage.getProvider<ConfigPage>(),
    ConfigPageAttribute.getProvider<ConfigPageAttribute>()
];
