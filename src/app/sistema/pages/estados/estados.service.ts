import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Estado, Estados, EstadosPaginate } from "./estados";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class EstadosService{
    constructor(private http: HttpClient){}

      index(): Observable<Estados> {
        return this.http.get<Estados>(`${API}/estados`);
      }

      /*
      index2(): Observable<EstadosPaginate> {
        return this.http.get<EstadosPaginate>(`${API}/estados2`);
      }

      paginate(url:string): Observable<EstadosPaginate> {
        return this.http.get<EstadosPaginate>(url);
      }*/

      where(id: number): Observable<Estados> {
        return this.http.get<Estados>(`${API}/paises/${id}/estados`);
      }
    
      store(data: Estado){
        return this.http.post(`${API}/estados`,data);
      }
    
      update(data: Estado){
        return this.http.put(`${API}/estados/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/estados/${id}`);
      }
}