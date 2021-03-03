
import { Characteristic } from './Characteristic.entity';
import { CharacteristicDependence } from './CharacteristicDependence.entity';
import { CharacteristicDescription } from './CharacteristicDescription.entity';
import { CharacteristicDescriptionDeletions } from './CharacteristicDescriptionDeletions.entity';
import { CharacteristicHeading } from './CharacteristicHeading.entity';
import { CharacteristicLanguage } from './CharacteristicLanguage.entity';
import { CharacteristicTaxonLink } from './CharacteristicTaxonLink.entity';
import { CharacterState } from './CharacterState.entity';
import { CharacterStateImage } from './CharacterStateImage.entity';
import { CharacterStateLanguage } from './CharacterStateLanguage.entity'
        
export const providers = [
    Characteristic.getProvider<Characteristic>(),
    CharacteristicDependence.getProvider<CharacteristicDependence>(),
    CharacteristicDescription.getProvider<CharacteristicDescription>(),
    CharacteristicDescriptionDeletions.getProvider<CharacteristicDescriptionDeletions>(),
    CharacteristicHeading.getProvider<CharacteristicHeading>(),
    CharacteristicLanguage.getProvider<CharacteristicLanguage>(),
    CharacteristicTaxonLink.getProvider<CharacteristicTaxonLink>(),
    CharacterState.getProvider<CharacterState>(),
    CharacterStateImage.getProvider<CharacterStateImage>(),
    CharacterStateLanguage.getProvider<CharacterStateLanguage>()
];
