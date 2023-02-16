import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";
import { Login } from "./login";

const URL = environment.url;

@Injectable({
    providedIn: 'root'
})

export class LoginService{
    constructor(private http: HttpClient){
        
    }

    entrar(data: Login){
        return this.http.post(`${URL}/login`, data);
    }
}