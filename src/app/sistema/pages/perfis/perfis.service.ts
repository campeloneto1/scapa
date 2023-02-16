import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Perfil, Perfis } from "./perfis";


const API = environment.url;


@Injectable({
    providedIn: 'root',
  })
  export class PerfisService {
    constructor(private http: HttpClient) {}
  
    index(): Observable<Perfis> {
      return this.http.get<Perfis>(`${API}/perfis`);
    }

    show(id: number): Observable<Perfil> {
        return this.http.get<Perfil>(`${API}/perfis/${id}`);
    }
  
    store(data: Perfil){
      return this.http.post(`${API}/perfis`,data);
    }
  
    update(data: Perfil){
      return this.http.put(`${API}/perfis/${data.id}`,data);
    }
  
    destroy(id: number){
      return this.http.delete(`${API}/perfis/${id}`);
    }
  }
  