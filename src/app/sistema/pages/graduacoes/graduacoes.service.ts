import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Graduacao, Graduacoes } from "./graduacoes";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class GraduacoesService{
    constructor(private http: HttpClient){}

     index(): Observable<Graduacoes> {
        return this.http.get<Graduacoes>(`${API}/graduacoes`);
      }

      store(data: Graduacao){
        return this.http.post(`${API}/graduacoes`,data);
      }
    
      update(data: Graduacao){
        return this.http.put(`${API}/graduacoes/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/graduacoes/${id}`);
      }
}