import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environments";
import { Log, Logs } from "./logs";

const API = environment.url;

@Injectable({
    providedIn: 'root'
})

export class LogsService{
    constructor(private http: HttpClient){}

    index(): Observable<Logs> {
        return this.http.get<Logs>(`${API}/logs`);
      }
    
      store(data: Log){
        return this.http.post(`${API}/logs`,data);
      }
    
      update(data: Log){
        return this.http.put(`${API}/logs/${data.id}`,data);
      }
    
      destroy(id: number){
        return this.http.delete(`${API}/logs/${id}`);
      }
}