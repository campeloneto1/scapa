import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Sexo, Sexos } from "./sexos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class SexosService{
    constructor(private http: HttpClient){}

     index(): Observable<Sexos> {
        return this.http.get<Sexos>(`${API}/sexos`);
      }

      store(data: Sexo){
        return this.http.post(`${API}/sexos`,data);
      }
    
      update(data: Sexo){
        return this.http.put(`${API}/sexos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/sexos/${id}`);
      }
}