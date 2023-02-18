import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Niveis } from "../niveis/niveis";
import { Postos } from "../postos/postos";
import { Setores } from "../setores/setores";
import { Orgao, Orgaos } from "./orgaos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class OrgaosService{
    constructor(private http: HttpClient){}

    index(): Observable<Orgaos> {
        return this.http.get<Orgaos>(`${API}/orgaos`);
      }

      where_niveis(id: number): Observable<Niveis> {
        return this.http.get<Niveis>(`${API}/orgaos/${id}/niveis`);
      }

      where_postos(id: number): Observable<Postos> {
        return this.http.get<Postos>(`${API}/orgaos/${id}/postos`);
      }

      where_setores(id: number): Observable<Setores> {
        return this.http.get<Setores>(`${API}/orgaos/${id}/setores`);
      }

      show(id: number): Observable<Orgao> {
        return this.http.get<Orgao>(`${API}/orgaos/${id}`);
      }
    
      store(data: Orgao){
        return this.http.post(`${API}/orgaos`,data);
      }
    
      update(data: Orgao){
        return this.http.put(`${API}/orgaos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/orgaos/${id}`);
      }
}