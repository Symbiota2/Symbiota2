import { Inject, Injectable } from '@nestjs/common';
import {
    Collection,
    Occurrence,
    OccurrenceComment
} from '@symbiota2/api-database';
import { Repository } from 'typeorm';

@Injectable()
export class OccurrenceCommentService {
    constructor(@Inject(OccurrenceComment.PROVIDER_ID) private readonly comments: Repository<OccurrenceComment>) { }

    findByID(commentID: number): Promise<OccurrenceComment> {
        return this.comments.findOne({ id: commentID })
    }

    findByOccurrenceID(occurrenceID: number): Promise<OccurrenceComment[]> {
        return this.comments.find({ where: { occurrenceID }, relations: ['commenter'] });
    }

    async findByCollectionID(collectionID: number): Promise<OccurrenceComment[]> {
        return await this.comments.createQueryBuilder('c')
            .select()
            .innerJoin(Occurrence, 'o', 'c.occurrenceID = o.id')
            .innerJoin(Collection, 'coll', 'o.collectionID = coll.id')
            .where('coll.id = :collectionID', { collectionID })
            .getMany();
    }

    async add(occurrenceID: number, commenterUID: number, commentText: string): Promise<OccurrenceComment> {
        let comment = this.comments.create({ occurrenceID, uid: commenterUID, comment: commentText });
        comment = await this.comments.save(comment);
        comment.commenter = await comment.commenter;
        return comment;
    }

    async findCollectionIDForComment(commentID: number): Promise<number> {
        const comment = await this.comments.findOne({ id: commentID });
        if (!comment) {
            return null;
        }

        const qb = await this.comments.createQueryBuilder('c')
            .select('coll.id as collectionID')
            .innerJoin(Occurrence, 'o', 'c.occurrenceID = o.id')
            .innerJoin(Collection, 'coll', 'o.collectionID = coll.id')
            .where('c.id = :commentID', { commentID: comment.id })
            .getRawOne<{ collectionID: number }>();

        return qb.collectionID;
    }

    async deleteByID(commentID: number): Promise<boolean> {
        const results = await this.comments.delete({ id: commentID });
        return results.affected > 0;
    }
}
