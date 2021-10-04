export class Comment {
    constructor(data: Record<string, unknown>) {
        Object.assign(this, data);
    }

    postID: string
    postAuthor: string
    postDate: string
    commentID: number
    commentAuthor: string
    content: string
    timeStamp: string
    status: number
    public: number
}