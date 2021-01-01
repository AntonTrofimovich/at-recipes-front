import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private readonly _http: HttpClient) { }

  public getData(): Observable<string> {
    return this._http.get("http://localhost:3000/anton", {responseType: "text"})
  }
}
