// import { Exclude, Expose, plainToClass, Type } from 'class-transformer'

// @Exclude()
// export class ChecklistProject {
//     @Expose() id: number
//     @Expose() kingdomName: string
//     @Expose() rankID: number | null
//     @Expose() scientificName: string
//     @Expose() unitInd1: string
//     @Expose() unitName1: string
//     @Expose() unitInd2: string
//     @Expose() unitName2: string
//     @Expose() unitInd3: string
//     @Expose() unitName3: string
//     @Expose() author: string
//     @Expose() phyloSortSequence: number | null
//     @Expose() status: string
//     @Expose() source: string
//     @Expose() notes: string
//     @Expose() hybrid: string
//     @Expose() securityStatus: number
//     @Expose() lastModifiedUID: number | null
// //    @Expose() lastModifiedTimestamp: Date | null
// //    @Expose() initialTimestamp: Date

//     static fromJSON(checklistProjectJson: Record<string, unknown>): ChecklistProject {
//         return plainToClass(
//             ChecklistProject,
//             checklistProjectJson,
//             { excludeExtraneousValues: true, enableImplicitConversion: true }
//         );
//     }
// }

import { ChecklistProjectLink } from '@symbiota2/api-database';
import { Exclude, Expose, plainToClass } from 'class-transformer';


@Exclude()
export class ChecklistProject {
    @Expose() id: number
    @Expose() name: string
    @Expose() managers: string
    @Expose() fullDescription: string
    @Expose() clids: number[]

    static fromJSON(projectJSON: Record<string, unknown>): ChecklistProject {
        return plainToClass(
            ChecklistProject,
            projectJSON,
            { excludeExtraneousValues: true, enableImplicitConversion: true }
        );
    }
}