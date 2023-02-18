import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Acessos } from "../acessos/acessos";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class RelatoriosService{
    constructor(private http: HttpClient){}

      relAcessos(data: any): Observable<Acessos>{
        return this.http.post<Acessos>(`${API}/rel-acessos`,data);
      }
         
}