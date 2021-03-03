import { providers as actionRequestProviders } from './entities/action-request/providers';
import { providers as agentProviders } from './entities/agent/providers';
import { providers as characteristicProviders } from './entities/characteristic/providers';
import { providers as checklistProviders } from './entities/checklist/providers';
import { providers as collectionProviders } from './entities/collection/providers';
import { providers as configPageProviders } from './entities/config-page/providers';
import { providers as crowdSrcProviders } from './entities/crowd-source/providers';
import { providers as exisccatiProviders } from './entities/exsiccati/providers';
import { providers as geoLookupProviders } from './entities/geo-lookup/providers';
import { providers as geoThesaurusProviders } from './entities/geo-thesaurus/providers';
import { providers as glossaryProviders } from './entities/glossary/providers';
import { providers as imageProviders } from './entities/image/providers';
import { providers as occurrenceProviders } from './entities/occurrence/providers';
import { providers as projectProviders } from './entities/project/providers';
import { providers as referenceProviders } from './entities/reference/providers';
import { providers as specProcessorProviders } from './entities/species-processor/providers';
import { providers as taxonProviders } from './entities/taxonomy/providers';
import { providers as traitProviders } from './entities/trait/providers';
import { providers as unknownProviders } from './entities/unknown-taxon/providers';
import { providers as uploadProviders } from './entities/upload/providers';
import { providers as userProviders } from './entities/user/providers';
import { AdminLanguage } from './entities';
import { AdminStat } from './entities';
import { ChotomousKey } from './entities';
import { Collector } from './entities';
import { Configuration } from './entities';
import { CtNameType } from './entities';
import { CtRelationshipType } from './entities';
import { Institution } from './entities';
import { Medium } from './entities';
import { Paleochronostratigraphy } from './entities';
import { SalixWordStat } from './entities';
import { SchemaVersion } from './entities';
import { Voucher } from './entities';

const miscProviders = [
    AdminLanguage.getProvider<AdminLanguage>(),
    AdminStat.getProvider<AdminStat>(),
    ChotomousKey.getProvider<ChotomousKey>(),
    Collector.getProvider<Collector>(),
    Configuration.getProvider<Configuration>(),
    CtNameType.getProvider<CtNameType>(),
    CtRelationshipType.getProvider<CtRelationshipType>(),
    Institution.getProvider<Institution>(),
    Medium.getProvider<Medium>(),
    Paleochronostratigraphy.getProvider<Paleochronostratigraphy>(),
    SalixWordStat.getProvider<SalixWordStat>(),
    SchemaVersion.getProvider<SchemaVersion>(),
    Voucher.getProvider<Voucher>()
];

export const entityProviders = [
    ...actionRequestProviders,
    ...agentProviders,
    ...characteristicProviders,
    ...checklistProviders,
    ...collectionProviders,
    ...configPageProviders,
    ...crowdSrcProviders,
    ...exisccatiProviders,
    ...geoLookupProviders,
    ...geoThesaurusProviders,
    ...glossaryProviders,
    ...imageProviders,
    ...occurrenceProviders,
    ...projectProviders,
    ...referenceProviders,
    ...specProcessorProviders,
    ...taxonProviders,
    ...traitProviders,
    ...unknownProviders,
    ...uploadProviders,
    ...userProviders,
    ...miscProviders
];
