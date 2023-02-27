import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Evento , Eventos } from "./eventos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class EventosService{
    constructor(private http: HttpClient){}

    index(): Observable<Eventos> {
        return this.http.get<Eventos>(`${API}/eventos`);
      }

      show(id: number): Observable<Evento> {
        return this.http.get<Evento>(`${API}/eventos/${id}`);
      }
    
      store(data: Evento){
        return this.http.post(`${API}/eventos`,data);
      }
    
      update(data: Evento){
        return this.http.put(`${API}/eventos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/eventos/${id}`);
      }
}