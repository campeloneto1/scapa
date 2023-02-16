import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Posto, Postos } from "./postos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class PostosService{
    constructor(private http: HttpClient){}

    index(): Observable<Postos> {
        return this.http.get<Postos>(`${API}/postos`);
      }

      show(id: number): Observable<Posto> {
        return this.http.get<Posto>(`${API}/postos/${id}`);
      }
    
      store(data: Posto){
        return this.http.post(`${API}/postos`,data);
      }
    
      update(data: Posto){
        return this.http.put(`${API}/postos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/postos/${id}`);
      }
}