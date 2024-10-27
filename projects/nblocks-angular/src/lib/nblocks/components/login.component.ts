import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'nblocks-login',
  template: ''
})
export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.redirectToLogin();
  }
}
