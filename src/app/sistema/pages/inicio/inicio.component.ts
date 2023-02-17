import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { InicioService } from "./inicio.service";

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['inicio.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class InicioComponent implements OnInit{

    quantDia!: number;
    quantMes!: number;
    quantPorDia!: any;
    quantPorSetor!: any;

    constructor(private inicioService: InicioService){
        
    }

    ngOnInit(): void {
        this.inicioService.acessosDia().subscribe({
            next: (data) => {
                this.quantDia = data as number;
            },
            error: (error) => {

            }
        });

        this.inicioService.acessosMes().subscribe({
            next: (data) => {
                this.quantMes = data as number;
            },
            error: (error) => {

            }
        });

        this.inicioService.acessosPorDia().subscribe({
            next: (data) => {
                this.quantPorDia = data;
                
            },
            error: (error) => {

            }
        });

        this.inicioService.acessosPorSetor().subscribe({
            next: (data) => {
                this.quantPorSetor = data;            
            },
            error: (error) => {

            }
        });
    }

    
}