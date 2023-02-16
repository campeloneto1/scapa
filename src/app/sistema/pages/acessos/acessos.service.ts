import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Acesso , Acessos } from "./acessos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class AcessosService{
    constructor(private http: HttpClient){}

    index(): Observable<Acessos> {
        return this.http.get<Acessos>(`${API}/acessos`);
      }

      show(id: number): Observable<Acesso> {
        return this.http.get<Acesso>(`${API}/acessos/${id}`);
      }
    
      store(data: Acesso){
        return this.http.post(`${API}/acessos`,data);
      }
    
      update(data: Acesso){
        return this.http.put(`${API}/acessos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/acessos/${id}`);
      }
}