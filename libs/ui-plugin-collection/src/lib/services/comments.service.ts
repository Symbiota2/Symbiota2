import { Injectable } from '@angular/core';
import {
    ApiClientService,
    AlertService,
    UserService,
} from '@symbiota2/ui-common';
import { CommentOutputDto } from '../dto/Comment.output.dto';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { cpuUsage } from 'node:process';

interface FindAllParams {
    id?: number | number[];
    postID?: string | string[];
    limit?: number;
    orderBy?: string;
}

@Injectable()
export class CommentService {
    private readonly COMMENT_BASE_URL = `${this.api.apiRoot()}/comments`;

    static comments: CommentOutputDto[] = [
        {
            postID: "BBSL228328",
            postAuthor: "S.Vanderwall",
            postDate: "1997-10-09",
            commentID: 0,
            commentAuthor: "Cobb, Neil",
            timeStamp:"2020-11-9 15:04:19",
            status:0,
            public:0,
            comment:"This is misidentified, B. cockerelli is restricted to cockerelli is limited to Otero and Lincoln continues in New Mexico, at high elevation"
        }
    ]

    constructor(
        private readonly api: ApiClientService,
        private readonly user: UserService,
        private readonly alert: AlertService
    ) {}

    getComments(findAllParams?: FindAllParams): Observable<CommentOutputDto[]> {
        // TODO: GET to api
        // const url = this.api.queryBuilder(this.COMMENT_BASE_URL).get();

        // return this.api.send(url.build()).pipe(
        //     map((comments: CommentOutputDto[]) => {
        //         return comments;
        //     })
        // );

        return of(CommentService.comments)
    }

    setPublic(commentID: number, value: number): number{
        //TODO: POST to api
        
        if(CommentService.comments[commentID] != null){
            
            CommentService.comments[commentID].public = value;
            return 1;
        }else{ return 0;}
    }

    setStatus(commentID: number, value: number): number{
        //TODO: POST to api

        if(CommentService.comments[commentID] != null){
            
            CommentService.comments[commentID].status = value;
            return 1;
        }else{ return 0;}
    }
}
