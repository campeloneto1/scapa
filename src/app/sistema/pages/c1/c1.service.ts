import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { C1, C1s } from "./c1";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class C1Service{
    constructor(private http: HttpClient){}

     index(): Observable<C1s> {
        return this.http.get<C1s>(`${API}/c1`);
      }

      store(data: C1){
        return this.http.post(`${API}/c1`,data);
      }
    
      update(data: C1){
        return this.http.put(`${API}/c1/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/c1/${id}`);
      }
}