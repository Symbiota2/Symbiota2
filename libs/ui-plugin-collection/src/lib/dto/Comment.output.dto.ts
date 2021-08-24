export class CommentOutputDto {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    postID: string
    postAuthor: string
    postDate: string
    commentID: number
    commentAuthor: string
    comment: string
    timeStamp: string
    status: number
    public: number
}