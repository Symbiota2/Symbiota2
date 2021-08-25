import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../services/comments.service';
import { Comment } from '../../dto/Comment.output.dto';

@Component({
  selector: 'symbiota2-collection-comment',
  templateUrl: './collection-comment.component.html',
  styleUrls: ['./collection-comment.component.scss']
})
export class CollectionCommentComponent implements OnInit { 

  @Input() comment: Comment;


  constructor() { }

  ngOnInit(): void {

  }


}
