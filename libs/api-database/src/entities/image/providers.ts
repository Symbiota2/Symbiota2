import { GuidImage } from './GuidImage.entity';
import { Image } from './Image.entity';
import { ImageAnnotation } from './ImageAnnotation.entity';
import { ImageKeyword } from './ImageKeyword.entity';
import { ImageProject } from './ImageProject.entity';
import { ImageProjectLink } from './ImageProjectLink.entity';
import { ImageTag } from './ImageTag.entity';
import { ImageTagKey } from './ImageTagKey.entity'

export const providers = [
    GuidImage.getProvider<GuidImage>(),
    Image.getProvider<Image>(),
    ImageAnnotation.getProvider<ImageAnnotation>(),
    ImageKeyword.getProvider<ImageKeyword>(),
    ImageProject.getProvider<ImageProject>(),
    ImageProjectLink.getProvider<ImageProjectLink>(),
    ImageTag.getProvider<ImageTag>(),
    ImageTagKey.getProvider<ImageTagKey>()
];
