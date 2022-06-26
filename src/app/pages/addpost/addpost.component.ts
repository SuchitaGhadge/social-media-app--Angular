import { Component, OnInit } from '@angular/core';

//router and toastr
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// auth services
import { AuthService } from 'src/app/services/auth.service';

// firebase
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

// rxjs
import { finalize } from 'rxjs';

// ngForm
import { NgForm } from '@angular/forms';

// uuid
import { v4 as uuid } from "uuid"

// browser image resizer
import { readAndCompressImage } from 'browser-image-resizer'
// const { readAndCompressImage } = require('browser-image-resizer');
import { imageConfig } from 'src/utils/config';
@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  locationName : string;
  description : string;
  picture : string = null;

  user : any;
  uploadPercent : number = null;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {
    this.auth.getUser().subscribe(
      user => {
        console.log("user id", user.uid)
        this.db.object(`/users/${user.uid}`)
        .valueChanges()   //this will update user as soon as value changes
        .subscribe((user) => {
          console.log("user here", user)
          this.user = user
        })
      }
    )
   }

  ngOnInit(): void {
  }

  onSubmit(){
    const uid = uuid()

    this.db.object(`/posts/${uid}`)
    .set({
      id: uid,
      locationName : this.locationName,
      description : this.description,
      picture : this.picture,
      by : this.user.name,
      instaId : this.user.instaUserName,
      date : Date.now()
    })
    .then(() => {
      this.toastr.success("post added success")
      this.router.navigateByUrl('/')
    })
    .catch((err) => {
      console.log("err", err)
      this.toastr.error("Something went wrong")
    })
  }

  // upload and resize image
  async uploadFile(event:any){
    const file = event.target.files[0]

    let resizedImage = await readAndCompressImage(file, imageConfig)
    
    const filePath = uuid(file.name)
    const fileRef = this.storage.ref(filePath)

    const task = this.storage.upload(filePath, resizedImage)

    task.percentageChanges().subscribe(percentage => {
      console.log("percent", this.uploadPercent)
      this.uploadPercent = percentage
    })

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url
          this.toastr.success("Image upload success")
        })
      })
    ).subscribe()
  }
}
