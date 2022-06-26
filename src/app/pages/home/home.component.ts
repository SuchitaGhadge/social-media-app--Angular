import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users = [];
  posts = [];
  isLoading: boolean = false;
  constructor(
    private toastr : ToastrService,
    private db : AngularFireDatabase
  ) { 
    this.isLoading = true

    // get all users
    this.db.object('/users')
    .valueChanges()
    .subscribe(
      (obj) => {
        if(obj){
          this.users = Object.values(obj)
          this.isLoading = false
        }else{
          this.toastr.error("No user found")
          this.users = []
          this.isLoading = false
        }
      }
    )

    this.db.object('/posts')
    .valueChanges()
    .subscribe((obj) => {
      if(obj){
        this.posts = Object.values(obj).sort((a,b) => b.date - a.date)
        this.isLoading = false
      }else{
        this.toastr.error("No post to display")
        this.posts = []
        this.isLoading = false
      }
      
    })
  }

  ngOnInit(): void {
  }

}
