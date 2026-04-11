import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = 'https://us-central1-txurygurumis.cloudfunctions.net/sendContact';

  constructor(private http: HttpClient) {}

  sendContact(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}