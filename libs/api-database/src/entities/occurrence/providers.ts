import { Occurrence } from './Occurrence.entity';


export const providers = [
    Occurrence.getProvider<Occurrence>(),
];
