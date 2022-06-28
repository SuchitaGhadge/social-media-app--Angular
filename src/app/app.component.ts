import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  themeToggle : any 
  setMode : any
  constructor(
    private auth: AuthService
  ){
    this.setMode = localStorage.getItem('darkMode')
    console.log("set",this.setMode)
    if(this.setMode == 'true'){
      this.themeToggle = this.setMode
      console.log("if", this.themeToggle)
    }
  }
  title = 'social-media-app';

  toggleTheme(event){
    console.log("in app",event)
    this.themeToggle = event
    localStorage.setItem("darkMode", this.themeToggle)
    console.log("toggle", this.themeToggle)
  }
}
