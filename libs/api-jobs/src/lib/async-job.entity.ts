import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum AsyncJobStatus {
    QUEUED = 1,
    RUNNING = 2,
    SUCCEEDED = 3,
    FAILED = 4
}

@Entity()
export class AsyncJob<I, O> {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    uid: number;

    /**
     * Path to the file to run
     */
    @Column()
    runner: string;

    @Column('integer')
    status: AsyncJobStatus;

    @Column('string')
    inputData: I;

    @Column('string')
    outputData: O;
}

export interface IAsyncJob<I, O> extends AsyncJob<I, O> { }
