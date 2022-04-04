import { Exclude, Expose, plainToClass } from 'class-transformer';


@Exclude()
export class ChecklistProject {
    @Expose() name: string
    @Expose() managers: string
    @Expose() briefDescription: string

    static fromJSON(projectJSON: Record<string, unknown>): ChecklistProject {
        return plainToClass(
            ChecklistProject,
            projectJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}
