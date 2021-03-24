import { AuthenticatedRequest } from '@symbiota2/api-auth';

export interface CollectionRequest extends AuthenticatedRequest {
    collectionID?: number;
}
