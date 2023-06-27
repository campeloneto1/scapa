import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { AutoridadeAcesso, AutoridadesAcessos } from "./autoridades-acessos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class AutoridadesAcessosService{
    constructor(private http: HttpClient){}

     index(): Observable<AutoridadesAcessos> {
        return this.http.get<AutoridadesAcessos>(`${API}/autoridades-acessos`);
      }

      store(data: AutoridadeAcesso){
        return this.http.post(`${API}/autoridades-acessos`,data);
      }
    
      update(data: AutoridadeAcesso){
        return this.http.put(`${API}/autoridades-acessos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/autoridades-acessos/${id}`);
      }
}