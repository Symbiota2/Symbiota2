import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OccurrenceUploadResponse {
    constructor(jobID: string) {
        this.jobID = jobID;
    }

    @Expose()
    jobID: string;
}
