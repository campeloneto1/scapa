import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class ImportacaoService{
    constructor(private http: HttpClient){}

    importar(data: any){
        return this.http.post(`${API}/importar`,data);
    }      
}