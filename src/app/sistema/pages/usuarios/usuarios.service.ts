import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Usuario, Usuarios } from "./usuarios";


const API = environment.url;


@Injectable({
    providedIn: 'root',
  })
  export class UsuariosService {
    constructor(private http: HttpClient) {}
  
    index(): Observable<Usuarios> {
      return this.http.get<Usuarios>(`${API}/users`);
    }

    show(id: number): Observable<Usuario> {
      return this.http.get<Usuario>(`${API}/users/${id}`);
  }
  
    changpass(data: any){
      return this.http.post(`${API}/users-changpass`,data);
    }
  
    resetpass(id: number){
      return this.http.get(`${API}/users/${id}/resetpass`);
    }
  
    store(data: Usuario){
      return this.http.post(`${API}/users`,data);
    }
  
    update(data: Usuario){
      return this.http.put(`${API}/users/${data.id}`,data);
    }
  
    destroy(id: number){
      return this.http.delete(`${API}/users/${id}`);
    }
  }
  