
import { Unknown } from './Unknown.entity';
import { UnknownComment } from './UnknownComment.entity';
import { UnknownImage } from './UnknownImage.entity'
        
export const providers = [
    Unknown.getProvider<Unknown>(),
    UnknownComment.getProvider<UnknownComment>(),
    UnknownImage.getProvider<UnknownImage>()
];
