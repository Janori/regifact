import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MdDialog, MdDialogRef} from '@angular/material';
import { DialogResultCreateComponent } from '../../shared/dialog-result-create/dialog-result-create.component';
import { FormsModule, NgForm, NgModel,
         FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { UsersService, IKeyValue, IUser } from '../../../services/users.service';

const EMAIL_REGEX = '^([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)?$';

@Component({
  selector: 'app-dashboard-users-create',
  templateUrl: './dashboard-users-create.component.html',
  styles: [`
    .input-style {
      margin-top: 20px;
      display: block;
      width: 300px;
    }
    .selector-style{
      margin-top: 30px;
    }
  `]
})
export class DashboardUsersCreateComponent implements OnInit {

  forma:FormGroup;
  roles:IKeyValue[] = [];
  rolSelected:number = 1;

  kindSelected:string = "u";

  saving:boolean = false;

  generatedId:number = 0;

  constructor(private activatedRoute:ActivatedRoute,
              private router:Router,
              private userService:UsersService,
              public dialog: MdDialog) {
    //this.user.kind = "u";
    this.forma = new FormGroup({
      'username': new FormControl('',
        Validators.required,
        this.checkUserName.bind(this)
      ),
      'email': new FormControl('',
        Validators.pattern(EMAIL_REGEX),
        this.checkEmail.bind(this)
      ),
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern("^([\\wÀ-ÿ]+)(\\s[\\wÀ-ÿ]+){1,3}$")
      ]),
      'password': new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern("^([a-zA-Z0-9.?!$#@_-]|[\\d*])+$")
      ]),
      'password_repeat': new FormControl('', [
        this.checkEquals.bind(this)
      ]),
      'rol': new FormControl(this.kindSelected, Validators.required)
    });
    this.forma.controls['password_repeat'].markAsTouched();
    this.forma.controls['password'].valueChanges.subscribe(value=>{
      this.forma.controls['password_repeat'].updateValueAndValidity();
    });
  }
  ngOnInit() {
    this.userService.getAllRoles().subscribe(data =>{
      this.roles = data.filter(rol=>{
        return rol.code != "provider";
      });
    });
  }

  save(form:FormGroup){
    if(form.valid){
      var obj:any = {}
      obj = {
        "username":form.controls['username'].value,
        "password":form.controls['password'].value,
        "email": form.controls['email'].value,
        "role_id":form.controls['rol'].value,
        "kind": this.kindSelected,
        "name": form.controls['name'].value
      }
      this.saving = true;
      this.userService.createUser(obj).subscribe(data=>{
        if(data.status){
          this.generatedId = data.data.id;
          this.openDialog();
        }else{
          alert('Ocurrió un error al modificar el usuario');
        }
        this.saving = false;
      },error=>{
        this.saving = true;
      })
    }
  }

  checkEquals(control:FormControl): {[s:string]:boolean} {
    let forma:any = this.forma;
    if(forma == null) return null;
    if(control.value != forma.controls['password'].value){
      return { notEqual:true };
    }else return null;
  }

  checkUserName(control:FormControl): Promise<any>|Observable<any>{
    return this.userService.userExists(control.value, false);
  }
  checkEmail(control:FormControl): Promise<any>|Observable<any>{
    return this.userService.userExists(control.value, true);
  }

  openDialog() {
    let dialogRef = this.dialog.open(DialogResultCreateComponent);
    dialogRef.afterClosed().subscribe(result => {
      switch(result){
        case 'new':
          this.router.navigate(['./dashboard/users/create']);
        break;
        case 'edit':
        this.router.navigate(['./dashboard/users', this.generatedId, 'edit']);
        break;
        default:
          this.router.navigate(['./dashboard/users']);
        break;
      }
    });
  }
}
