import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Pessoa, Pessoas } from "./pessoas";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class PessoasService{
    constructor(private http: HttpClient){}

     index(): Observable<Pessoas> {
        return this.http.get<Pessoas>(`${API}/pessoas`);
      }

      show(id: number): Observable<Pessoa> {
        return this.http.get<Pessoa>(`${API}/pessoas/${id}`);
      }

      checkCpf(id: number) {
        return this.http.get(`${API}/pessoas/${id}/checkcpf`);
      }

      checkCpf2(id: number) {
        return this.http.get<Pessoa>(`${API}/pessoas/${id}/checkcpf`);
      }

      searchCpf(id: number) {
        return this.http.get<Pessoa>(`${API}/pessoas/${id}/searchcpf`);
      }

      searchPessoa(id: string) {
        return this.http.get<Pessoas>(`${API}/pessoas/${id}/search`);
      }

      whereEvento(id: number) {
        return this.http.get(`${API}/pessoas/${id}/evento`);
      }

      updateAcesso(data: Pessoa){
        return this.http.patch(`${API}/pessoas/${data.id}/altacesso`, data.id);
      }

      store(data: Pessoa){
        return this.http.post(`${API}/pessoas`,data);
      }

      update(data: Pessoa){
        return this.http.put(`${API}/pessoas/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/pessoas/${id}`);
      }
}