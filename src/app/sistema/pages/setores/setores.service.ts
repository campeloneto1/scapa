import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Setor, Setores } from "./setores";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class SetoresService{
    constructor(private http: HttpClient){}

    index(): Observable<Setores> {
        return this.http.get<Setores>(`${API}/setores`);
      }

      show(id: number): Observable<Setor> {
        return this.http.get<Setor>(`${API}/setores/${id}`);
      }
    
      store(data: Setor){
        return this.http.post(`${API}/setores`,data);
      }
    
      update(data: Setor){
        return this.http.put(`${API}/setores/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/setores/${id}`);
      }
}