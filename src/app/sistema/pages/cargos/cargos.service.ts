import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Cargo, Cargos } from "./cargos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class CargosService{
    constructor(private http: HttpClient){}

     index(): Observable<Cargos> {
        return this.http.get<Cargos>(`${API}/cargos`);
      }

      store(data: Cargo){
        return this.http.post(`${API}/cargos`,data);
      }
    
      update(data: Cargo){
        return this.http.put(`${API}/cargos/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/cargos/${id}`);
      }
}