import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Funcionario, Funcionarios } from "./funcionarios";

const API = environment.url;

@Injectable({
    providedIn: 'root',
})

export class FuncionariosService{
    constructor(private http: HttpClient){

    }

    index(): Observable<Funcionarios> {
        return this.http.get<Funcionarios>(`${API}/funcionarios`);
      }

      show(id: number): Observable<Funcionario> {
        return this.http.get<Funcionario>(`${API}/funcionarios/${id}`);
      }
    
      store(data: Funcionario){
        return this.http.post(`${API}/funcionarios`,data);
      }
    
      update(data: Funcionario){
        return this.http.put(`${API}/funcionarios/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/funcionarios/${id}`);
      }
} 