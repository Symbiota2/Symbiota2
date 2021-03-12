import { Transform, Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    IsUUID
} from 'class-validator';
import { AsyncJobStatus, IAsyncJob } from './async-job.entity';


export class AsyncJobDto<I, O> implements IAsyncJob<I, O> {
    constructor(job: Record<string, unknown>) {
        Object.assign(this, job);
    }

    /**
     * A job UUID
     */
    @IsUUID()
    id: string;

    @IsInt()
    uid: number;

    /**
     * Path to the file to run
     */
    @IsString()
    @IsNotEmpty()
    runner: string;

    @IsNumber()
    @Type(() => Number)
    status: AsyncJobStatus;

    @IsObject()
    @Type(() => String)
    @Transform((t) => JSON.parse(t.value), { toClassOnly: true })
    inputData: I;

    @IsObject()
    @Transform((t) => JSON.parse(t.value), { toClassOnly: true })
    outputData: O;
}
