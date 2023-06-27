import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Autoridade, Autoridades } from "./autoridades";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class AutoridadesService{
    constructor(private http: HttpClient){}

     index(): Observable<Autoridades> {
        return this.http.get<Autoridades>(`${API}/autoridades`);
      }

      store(data: Autoridade){
        return this.http.post(`${API}/autoridades`,data);
      }
    
      update(data: Autoridade){
        return this.http.put(`${API}/autoridades/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/autoridades/${id}`);
      }
}