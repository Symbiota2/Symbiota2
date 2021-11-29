import {
    DWC_SCHEMA_LOCATION,
    DWC_XML_NS,
    IDwCAMeta,
    IDwCAMetaExtensionFileType,
    IDwCAMetaFieldType,
    IDwCAMetaFileLocationType, IDwCAMetaFileType
} from '../interfaces';
import * as xml2js from 'xml2js';
import { createWriteStream, WriteStream, promises as fsPromises } from 'fs';
import { basename, join as pathJoin } from 'path';
import { v4 as uuid4 } from 'uuid';
import { zipFiles } from '@symbiota2/api-common';
import { getDwcField, dwcRecordType, isDwCID } from '../decorators';
import { Logger } from '@nestjs/common';
import { PassThrough } from 'stream';

export class TaxonomyCSVBuilder {

}
