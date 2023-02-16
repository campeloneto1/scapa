import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Nivel, Niveis } from "./niveis";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class NiveisService{
    constructor(private http: HttpClient){}

     index(): Observable<Niveis> {
        return this.http.get<Niveis>(`${API}/niveis`);
      }

      show(id: number): Observable<Nivel> {
        return this.http.get<Nivel>(`${API}/niveis/${id}`);
      }

      store(data: Nivel){
        return this.http.post(`${API}/niveis`,data);
      }
    
      update(data: Nivel){
        return this.http.put(`${API}/niveis/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/niveis/${id}`);
      }
}