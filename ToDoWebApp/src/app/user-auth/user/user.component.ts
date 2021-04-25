import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userForm: FormGroup;
  invalidForm: boolean = false;
  apiError: boolean = false;

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.invalidForm = false;
    if (this.userForm.invalid) {
      this.invalidForm = true;
      return;
    }
    this.userService.saveUser(this.userForm.value).subscribe(
      (data: any) => {
        console.log(data);
        localStorage.setItem("userId", data.success.userId);
        this.router.navigate(['/notes']);
      }, (err: any) => {
        this.apiError = true;
        setTimeout(() => {
          this.apiError = false;
        }, 3000);
      });
  }

}
