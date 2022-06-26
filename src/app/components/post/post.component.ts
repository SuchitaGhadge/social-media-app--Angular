import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  faThumbsUp,
  faThumbsDown,
  faShareSquare
} from '@fortawesome/free-regular-svg-icons'
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {

  @Input() post;

  faThumbsUp = faThumbsUp
  faThumbsDown = faThumbsDown
  faShareSquare = faShareSquare

  uid:any = null

  upvote : number = 0;
  downvote : number = 0;
  constructor(
    private auth : AuthService,
    private db : AngularFireDatabase
  ) {
    this.auth.getUser().subscribe(
      user => this.uid = user?.uid
    )
   }

  ngOnInit(): void {
    console.log("ngOnInit")
  }

  ngOnChanges(): void {
    console.log("ngOnChange")
    if(this.post.vote){
      Object.values(this.post.vote).map(
        (vote:any) => {
          if(vote.upvote){
            this.upvote += 1
          }
          if(vote.downvote){
            this.downvote += 1
          }
        } 
      )
    }
  }

  upvotePost(){
    console.log("UPVOTING");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      upvote : 1
    })
  }

  downvotePost(){
    console.log("DOWNVOTING");
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`).set({
      downvote : 1
    })
  }

  getInstaUrl(){
    return `https://instagram.com/${this.post.instaId}`
  }

}
