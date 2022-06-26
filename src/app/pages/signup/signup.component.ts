import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// services
import { AuthService } from 'src/app/services/auth.service';

// firebase
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { AngularFireDatabase } from '@angular/fire/compat/database'

// angular form
import { NgForm } from '@angular/forms';

// rxjs
import { finalize } from 'rxjs';

// browser image resizer
import { readAndCompressImage } from 'browser-image-resizer';
// const { readAndCompressImage } = require('browser-image-resizer');
import { imageConfig } from 'src/utils/config';

// uuid
import {v4 as uuid} from 'uuid'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture: string = "https://cdn.worldvectorlogo.com/logos/instagram-glyph.svg";
  uploadPercent: number = null;

  constructor(
    private auth : AuthService,
    private router : Router,
    private toastr : ToastrService,
    private db : AngularFireDatabase,
    private storage : AngularFireStorage
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f : NgForm){
    const { name, email, password, username, bio, country } = f.form.value;
console.log(f.form.value)

    this.auth.signUp(email, password)
    .then(
      res => {
        console.log(res)
        const {uid} = res.user
        console.log("uid", uid)
        this.db.object(`/users/${uid}`)
        .set({
          id: uid,
          name: name,
          email: email,
          instaUserName: username,
          bio: bio,
          country: country,
          picture: this.picture
        })
      }
    )
    .then(() => {
      this.router.navigateByUrl('/')
      this.toastr.success("SignUp Success")
    })
    .catch(err => {
      console.error(err.message)
      this.toastr.error("SignUp failed")
    })
  }

  async uploadFile(event:any){
    const file = event.target.files[0]
    console.log("file", file)
    let resizeImage = await readAndCompressImage(file, imageConfig)

    // convert file name to uuid
    const filePath = uuid(file.name)
    const fileRef = this.storage.ref(filePath)

    const task = this.storage.upload(filePath, resizeImage)

    task.percentageChanges().subscribe(
      percentage => {
        console.log("percent", this.uploadPercent)
        this.uploadPercent = percentage
      }
    )

    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          console.log("pic url", url)
          this.picture = url
          this.toastr.success("image upload sucessful")
        })
      })
    )
    .subscribe()
  }

}
