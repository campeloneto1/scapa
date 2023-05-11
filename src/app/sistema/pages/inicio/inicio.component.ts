import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { InicioService } from "./inicio.service";
import { SharedService } from "../../shared/shared.service";
import type { ChartData, ChartOptions } from 'chart.js';
@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['inicio.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class InicioComponent implements OnInit, OnDestroy{

    months = [
        "",
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez"
    ]

    protected chartdata1: ChartData = {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            fill: false,
            backgroundColor: [
              'rgba(61, 153, 112)',
            ],
            borderColor: [
              'rgb(61, 153, 112)',
            ],
            borderWidth: 1,
          },
        ],
      };
    protected chartoptions1!: ChartOptions;

    protected chartdata2: ChartData = {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            fill: false,
            backgroundColor: [
              'rgba(61, 153, 112)',
            ],
            borderColor: [
              'rgb(61, 153, 112)',
            ],
            borderWidth: 1,
          },
        ],
      };
      protected chartoptions2!: ChartOptions;

    quantDia!: number;
    quantMes!: number;
    quantPorDia!: any;
    quantPorMes!: any;
    quantPorSetor!: any;
    proximosEventos!: any;

    protected subscription1!:any;
    protected subscription2!:any;
    protected subscription3!:any;
    protected subscription4!:any;
    protected subscription5!:any;
    protected subscription6!:any;

    constructor(private inicioService: InicioService,
        private sharedService: SharedService){
        
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
            next: (data:any) => {
                //this.quantPorDia = data;

                let labels2:any = [];
                let values2:any = [];

                data.forEach((element:any) => {
                    labels2.push(element.dia);
                    values2.push(element.quant);
                });

                //this.quantPorMes = data;
                //this.chartdata2 = this.sharedService.getChartData();        
                this.chartoptions2 = this.sharedService.getChartOptions();

                this.chartdata2.labels = labels2;
                this.chartdata2.datasets[0].data = values2;
                this.chartdata2.datasets[0].label = 'Acessos';
                
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
            next: (data:any) => {
                let labels:any = [];
                let values:any = [];

                data.forEach((element:any) => {
                    labels.push(this.months[element.mes]);
                    values.push(element.quant);
                });

                //this.quantPorMes = data;
                //this.chartdata1 = this.sharedService.getChartData();
                this.chartoptions1 = this.sharedService.getChartOptions();

                this.chartdata1.labels = labels;
                this.chartdata1.datasets[0].data = values;
                this.chartdata1.datasets[0].label = 'Acessos';


            },
            error: (error) => {

            }
        });

        
    }

    ngOnDestroy(): void {
        if(this.subscription1){
            this.subscription1.unsubscribe();
        }

        if(this.subscription2){
            this.subscription2.unsubscribe();
        }

        if(this.subscription3){
            this.subscription3.unsubscribe();
        }

        if(this.subscription4){
            this.subscription4.unsubscribe();
        }

        if(this.subscription5){
            this.subscription5.unsubscribe();
        }

        if(this.subscription6){
            this.subscription6.unsubscribe();
        }

    }

    onSelect(data:any){

    }
}