import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class InicioService{
    constructor(private http: HttpClient){}

    acessosDia(){
        return this.http.get(`${API}/inicio-acessos-dia`);
    }
    
    acessosMes(){
        return this.http.get(`${API}/inicio-acessos-mes`);
    }

    acessosPorDia(){
        return this.http.get(`${API}/inicio-acessos-por-dia`);
    }

    acessosPorSetor(){
        return this.http.get(`${API}/inicio-acessos-por-setor`);
    }

    proximosEventos(){
        return this.http.get(`${API}/inicio-proximos-eventos`);
    }
   
}