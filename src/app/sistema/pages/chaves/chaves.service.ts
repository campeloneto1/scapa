import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Chave, Chaves } from "./chaves";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class ChavesService{
    constructor(private http: HttpClient){}

    index(): Observable<Chaves> {
        return this.http.get<Chaves>(`${API}/chaves`);
      }

      show(id: number): Observable<Chave> {
        return this.http.get<Chave>(`${API}/chaves/${id}`);
      }
    
      store(data: Chave){
        return this.http.post(`${API}/chaves`,data);
      }
    
      update(data: Chave){
        return this.http.put(`${API}/chaves/${data.id}`,data);
      }

      receber(data: Chave){
        return this.http.put(`${API}/chaves/${data.id}/receber`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/chaves/${id}`);
      }
}