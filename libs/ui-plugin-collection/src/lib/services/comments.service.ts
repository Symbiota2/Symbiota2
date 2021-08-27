import { Injectable } from '@angular/core';
import {
    ApiClientService,
    AlertService,
    UserService,
} from '@symbiota2/ui-common';
import { Comment } from '../dto/Comment.output.dto';
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

    static comments: Comment[] = [
        {
            postID: 'BBSL228328',
            postAuthor: 'S.Vanderwall',
            postDate: '1997-10-09',
            commentID: 0,
            commentAuthor: 'Cobb, Neil',
            timeStamp: '2020-11-9 15:04:19',
            status: 0,
            public: 0,
            content:
                'This is misidentified, B. cockerelli is restricted to cockerelli is limited to Otero and Lincoln continues in New Mexico, at high elevation',
        },
        {
            postID: 'BASL228729',
            postAuthor: 'D.Houston',
            postDate: '1999-11-01',
            commentID: 1,
            commentAuthor: 'James, Williams',
            timeStamp: '2021-08-23 12:10:23',
            status: 1,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis. Feugiat nibh sed pulvinar proin. At tellus at urna condimentum mattis pellentesque id nibh. Ultrices tincidunt arcu non sodales neque. Venenatis tellus in metus vulputate.',
        },
        {
            postID: 'CAAE1684682',
            postAuthor: 'A.Nizbeth',
            postDate: '2002-04-03',
            commentID: 2,
            commentAuthor: 'Larry, Sonders',
            timeStamp: '2021-04-09 8:53:33',
            status: 0,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet nisl suscipit adipiscing bibendum est. Adipiscing diam donec adipiscing tristique risus. Augue mauris augue neque gravida in. Mattis vulputate enim nulla aliquet porttitor. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin. Sit amet tellus cras adipiscing enim.',
        },
        {
            postID: 'BBSL228328',
            postAuthor: 'S.Vanderwall',
            postDate: '1997-10-09',
            commentID: 3,
            commentAuthor: 'Cobb, Neil',
            timeStamp: '2020-11-9 15:04:19',
            status: 0,
            public: 0,
            content:
                'This is misidentified, B. cockerelli is restricted to cockerelli is limited to Otero and Lincoln continues in New Mexico, at high elevation',
        },
        {
            postID: 'BASL228729',
            postAuthor: 'D.Houston',
            postDate: '1999-11-01',
            commentID: 4,
            commentAuthor: 'James, Williams',
            timeStamp: '2021-08-23 12:10:23',
            status: 1,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis. Feugiat nibh sed pulvinar proin. At tellus at urna condimentum mattis pellentesque id nibh. Ultrices tincidunt arcu non sodales neque. Venenatis tellus in metus vulputate.',
        },
        {
            postID: 'CAAE1684682',
            postAuthor: 'A.Nizbeth',
            postDate: '2002-04-03',
            commentID: 5,
            commentAuthor: 'Larry, Sonders',
            timeStamp: '2021-04-09 8:53:33',
            status: 0,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet nisl suscipit adipiscing bibendum est. Adipiscing diam donec adipiscing tristique risus. Augue mauris augue neque gravida in. Mattis vulputate enim nulla aliquet porttitor. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin. Sit amet tellus cras adipiscing enim.',
        },
        {
            postID: 'BBSL228328',
            postAuthor: 'S.Vanderwall',
            postDate: '1997-10-09',
            commentID: 6,
            commentAuthor: 'Cobb, Neil',
            timeStamp: '2020-11-9 15:04:19',
            status: 0,
            public: 0,
            content:
                'This is misidentified, B. cockerelli is restricted to cockerelli is limited to Otero and Lincoln continues in New Mexico, at high elevation',
        },
        {
            postID: 'BASL228729',
            postAuthor: 'D.Houston',
            postDate: '1999-11-01',
            commentID: 7,
            commentAuthor: 'James, Williams',
            timeStamp: '2021-08-23 12:10:23',
            status: 1,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis. Feugiat nibh sed pulvinar proin. At tellus at urna condimentum mattis pellentesque id nibh. Ultrices tincidunt arcu non sodales neque. Venenatis tellus in metus vulputate.',
        },
        {
            postID: 'CAAE1684682',
            postAuthor: 'A.Nizbeth',
            postDate: '2002-04-03',
            commentID: 8,
            commentAuthor: 'Larry, Sonders',
            timeStamp: '2021-04-09 8:53:33',
            status: 0,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet nisl suscipit adipiscing bibendum est. Adipiscing diam donec adipiscing tristique risus. Augue mauris augue neque gravida in. Mattis vulputate enim nulla aliquet porttitor. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin. Sit amet tellus cras adipiscing enim.',
        },
        {
            postID: 'BBSL228328',
            postAuthor: 'S.Vanderwall',
            postDate: '1997-10-09',
            commentID: 9,
            commentAuthor: 'Cobb, Neil',
            timeStamp: '2020-11-9 15:04:19',
            status: 0,
            public: 0,
            content:
                'This is misidentified, B. cockerelli is restricted to cockerelli is limited to Otero and Lincoln continues in New Mexico, at high elevation',
        },
        {
            postID: 'BASL228729',
            postAuthor: 'D.Houston',
            postDate: '1999-11-01',
            commentID: 10,
            commentAuthor: 'James, Williams',
            timeStamp: '2021-08-23 12:10:23',
            status: 1,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget nulla facilisi etiam dignissim diam quis. Feugiat nibh sed pulvinar proin. At tellus at urna condimentum mattis pellentesque id nibh. Ultrices tincidunt arcu non sodales neque. Venenatis tellus in metus vulputate.',
        },
        {
            postID: 'CAAE1684682',
            postAuthor: 'A.Nizbeth',
            postDate: '2002-04-03',
            commentID: 11,
            commentAuthor: 'Larry, Sonders',
            timeStamp: '2021-04-09 8:53:33',
            status: 0,
            public: 1,
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Amet nisl suscipit adipiscing bibendum est. Adipiscing diam donec adipiscing tristique risus. Augue mauris augue neque gravida in. Mattis vulputate enim nulla aliquet porttitor. Nec tincidunt praesent semper feugiat nibh sed pulvinar proin. Sit amet tellus cras adipiscing enim.',
        },
        
    ];

    constructor(
        private readonly api: ApiClientService,
        private readonly user: UserService,
        private readonly alert: AlertService
    ) {}

    getComments(findAllParams?: FindAllParams): Observable<Comment[]> {
        // TODO: GET to api
        // const url = this.api.queryBuilder(this.COMMENT_BASE_URL).get();

        // return this.api.send(url.build()).pipe(
        //     map((comments: Comment[]) => {
        //         return comments;
        //     })
        // );

        return of(CommentService.comments);
    }

    setPublic(commentID: number, value: number): number {
        //TODO: POST to api

        if (CommentService.comments[commentID] != null) {
            CommentService.comments[commentID].public = value;

            value
                ? this.alert.showMessage(
                      `Comment was made public`
                  )
                : this.alert.showMessage(
                      `Comment was made private`
                  );
            return 1;
        } else {
            this.alert.showError(`Error: Unable to modify comment`);
            return 0;
        }
    }

    setStatus(commentID: number, value: number): number {
        //TODO: POST to api

        if (CommentService.comments[commentID] != null) {
            CommentService.comments[commentID].status = value;

            value
            ? this.alert.showMessage(
                  `Comment marked as reviewed`
              )
            : this.alert.showMessage(
                  `Comment marked for review`
              );
            return 1;
        } else {
            return 0;
        }
    }
}
