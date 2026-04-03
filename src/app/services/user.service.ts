import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private functions: Functions) {}

  updateUser(data: any){
    const fn = httpsCallable(this.functions, 'updateUser');
    return fn(data);
  }

  createUserAccount(data: any){
    const fn = httpsCallable(this.functions, 'createUserAccount');
    return fn(data);
  }
}