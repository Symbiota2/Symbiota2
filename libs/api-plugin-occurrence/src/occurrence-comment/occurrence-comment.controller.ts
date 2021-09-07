import {
    BadRequestException,
    Body,
    Controller,
    Delete, ForbiddenException,
    Get, InternalServerErrorException, NotFoundException,
    Param,
    Post, Query, Req,
    UseGuards
} from '@nestjs/common';
import { OccurrenceCommentService } from './occurrence-comment.service';
import {
    CommentIDParam,
    OccurrenceIDOrCollectionIDQuery,
    OccurrenceIDQuery
} from './dto/req-params';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OccurrenceComment } from '@symbiota2/api-database';
import { AddCommentBody } from './dto/add-comment-body';
import {
    AuthenticatedRequest,
    JwtAuthGuard,
    TokenService
} from '@symbiota2/api-auth';

@Controller('occurrence-comments')
@ApiTags('Occurrence Comments')
export class OccurrenceCommentController {
    constructor(private readonly comments: OccurrenceCommentService) { }

    @Get()
    @ApiResponse({ type: OccurrenceComment, isArray: true })
    findCommentsForOccurrence(@Query() params: OccurrenceIDOrCollectionIDQuery) {
        if (params.occurrenceID) {
            return this.comments.findByOccurrenceID(params.occurrenceID);
        }

        if (params.collectionID) {
            return this.comments.findByCollectionID(params.collectionID);
        }

        throw new BadRequestException('Must query by occurrenceID or collectionID');
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiResponse({ type: OccurrenceComment })
    addCommentForOccurrence(@Req() request: AuthenticatedRequest, @Query() params: OccurrenceIDQuery, @Body() commentData: AddCommentBody) {
        return this.comments.add(params.occurrenceID, request.user.uid, commentData.comment);
    }

    @Delete(':commentID')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async removeCommentForOccurrence(@Param() params: CommentIDParam, @Req() request: AuthenticatedRequest) {
        const comment = await this.comments.findByID(params.commentID);

        if (!comment) {
            throw new NotFoundException();
        }

        const collectionID = await this.comments.findCollectionIDForComment(comment.id);
        if (collectionID === null) {
            throw new NotFoundException('Collection not found');
        }

        // SuperAdmins, CollAdmins, CollEditors, and the Commenter themselves can delete comments
        const isSuperAdmin = TokenService.isSuperAdmin(request.user);
        const canEditCollection = TokenService.canEditCollection(request.user, collectionID);
        const isCommenter = request.user.uid === comment.uid;

        if (!(isSuperAdmin || canEditCollection || isCommenter)) {
            throw new ForbiddenException();
        }

        const success = await this.comments.deleteByID(comment.id);
        if (!success) {
            throw new InternalServerErrorException('Failed to delete comment');
        }
    }
}
