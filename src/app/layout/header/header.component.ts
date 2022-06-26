import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() themeToggle = new EventEmitter<boolean>();
  email : string | null = null;
  themeToggler:boolean = false;
  constructor(private auth: AuthService, private toastr:ToastrService, private router:Router ) {
    auth.getUser().subscribe((user) => {
      console.log("User is: ", user)
      this.email = user?.email ?? null;
    })
   }

  ngOnInit(): void {
  }

  async handleSignOut(){
    try {
      await this.auth.signOut()
      this.router.navigateByUrl("/signin")
      this.toastr.info("Signout Successful")
      this.email = null
    } catch (error) {
      this.toastr.error("Problem in signout")
    }
  }

  toggleTheme(){
    this.themeToggler = !this.themeToggler
    this.themeToggle.emit(this.themeToggler)
  }
}
