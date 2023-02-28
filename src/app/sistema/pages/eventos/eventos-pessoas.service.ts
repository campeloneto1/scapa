import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { EventoPessoa , EventosPessoas } from "./eventos-pessoas";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class EventosPessoasService{
    constructor(private http: HttpClient){}

    index(): Observable<EventosPessoas> {
        return this.http.get<EventosPessoas>(`${API}/eventos-pessoas`);
      }

      show(id: number): Observable<EventoPessoa> {
        return this.http.get<EventoPessoa>(`${API}/eventos-pessoas/${id}`);
      }

      presente(id?: number){
        return this.http.get(`${API}/eventos-pessoas/${id}/presente`);
      }
    
      store(data: any){
        return this.http.post(`${API}/eventos-pessoas`,data);
      }
    
      update(data: EventoPessoa){
        return this.http.put(`${API}/eventos-pessoas/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/eventos-pessoas/${id}`);
      }
}