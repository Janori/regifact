import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule, NgForm, NgModel,
         FormGroup, FormControl, Validators } from '@angular/forms';
import {MdSnackBar} from '@angular/material';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-dashboard-profile',
  templateUrl: './dashboard-profile.component.html',
  styles: [`
      .input-style {
        margin-top: 15px;
        display: block;
        width: 400px;
      }
      .selector-style{
        margin-top: 30px;
      }
      .left-margin{
        margin-left: 50px;
        margin-top: 5px;
      }
      .left-margin-fst{
        margin-left: 30px;
      }
      .sml{
        width: 5px;
      }
  `]
})
export class DashboardProfileComponent implements OnInit {

  form:FormGroup;

  constructor(private auth:AuthService,
              private userService:UsersService,
              private snackBar:MdSnackBar) { }

  ngOnInit() {
    this.form = new FormGroup({
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern("^([a-zA-Z0-9.?!$#@_-]|[\\d*])+$"),
        this.checkEquals.bind(this)
      ]),
      'password_repeat': new FormControl('', [
        this.checkEquals.bind(this)
      ])
    });
    this.form.controls['password_repeat'].markAsTouched();
    this.form.controls['password'].valueChanges.subscribe(value=>{
      this.form.controls['password_repeat'].updateValueAndValidity();
    });
  }

  updatePWD(form:FormGroup){
    console.log(form.controls['password'].value);
    this.userService.updatePWD(form.controls['password'].value).subscribe(data=>{
      console.log(data);
      this.openSnackBar("Contraseña actualizada correctamente.", "");
    }, error=>{
      this.openSnackBar("Ocurrió un error al actualizar.", "");
      console.log(error);
    });
  }

  checkEquals(control:FormControl): {[s:string]:boolean} {
    let form:any = this.form;
    if(form == null) return null;
    if(control.value != form.controls['password'].value){
      return { notEqual:true };
    }else return null;
  }

  logout(){
    this.auth.logout("/login");
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
