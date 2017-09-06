import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLogging = false;
  error = false;
  errorMsg = "";
  displayForm:string = "display";

  usuario:any = {
    user: '',
    pass: ''
  }

  headerText():string{
    return this.isLogging ? "Autenticando..." : "Bienvenido";
  }

  constructor(private authService:AuthService,
              private router:Router) { }

  ngOnInit() {
  }

  login(forma:NgForm){
    this.error = false;

    if(!this.isLogging){
      this.isLogging = true;
      setTimeout(()=>{
        this.displayForm = "none";
        this.authService.login(forma.value.user, forma.value.secret)
        .subscribe(res=>{
          if(!res){
            this.errorMsg = "Usuario o contraseña incorrecta."
            this.loginError();
          }else{
            this.router.navigate(['/home']);
          }
        }, error =>{
          this.errorMsg = error;
          this.loginError();
        });

      }, 700)
    }
  }

  loginError(){
    this.error = true;
    this.isLogging = false;
    this.displayForm = "block";
  }

}
