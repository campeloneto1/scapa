import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { Eventos } from "../eventos/eventos";
import { InicioService } from "./inicio.service";


@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['inicio.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class InicioComponent implements OnInit, OnDestroy{

    quantDia!: number;
    quantMes!: number;
    quantPorDia!: any;
    quantPorMes!: any;
    quantPorSetor!: any;
    proximosEventos!: any;

    subscription1!:any;
    subscription2!:any;
    subscription3!:any;
    subscription4!:any;
    subscription5!:any;
    subscription6!:any;

    constructor(private inicioService: InicioService){
        
    }

    ngOnInit(): void {
        this.subscription1 = this.inicioService.acessosDia().subscribe({
            next: (data) => {
                this.quantDia = data as number;
            },
            error: (error) => {

            }
        });

        this.subscription2 = this.inicioService.acessosMes().subscribe({
            next: (data) => {
                this.quantMes = data as number;
            },
            error: (error) => {

            }
        });

        this.subscription3 = this.inicioService.acessosPorSetor().subscribe({
            next: (data) => {
                this.quantPorSetor = data;
                
            },
            error: (error) => {

            }
        });

        this.subscription4 = this.inicioService.acessosPorDia().subscribe({
            next: (data) => {
                this.quantPorDia = data;
                
            },
            error: (error) => {

            }
        });

        this.subscription5 = this.inicioService.proximosEventos().subscribe({
            next: (data) => {
                this.proximosEventos = data;            
            },
            error: (error) => {

            }
        });

        this.subscription6 = this.inicioService.acessosPorMes().subscribe({
            next: (data) => {
                this.quantPorMes = data;
                
            },
            error: (error) => {

            }
        });
    }

    ngOnDestroy(): void {
        if(this.subscription1){
            this.subscription1.unsubscrib();
        }

        if(this.subscription2){
            this.subscription2.unsubscrib();
        }

        if(this.subscription3){
            this.subscription3.unsubscrib();
        }

        if(this.subscription4){
            this.subscription4.unsubscrib();
        }

        if(this.subscription5){
            this.subscription5.unsubscrib();
        }

    }

    onSelect(data:any){

    }
}