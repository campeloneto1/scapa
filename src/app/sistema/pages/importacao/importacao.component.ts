import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { TituloComponent } from "../../components/titulo/titulo.component";
import { DataTableDirective } from 'angular-datatables';
import { SharedModule } from "../../shared/shared.module";
import { SharedService } from "../../shared/shared.service";
import { SessionService } from "../../shared/session.service";
import { Observable, Subject, of } from "rxjs";
import { FormularioImportacaoComponent } from "./formulario/formulario-importacao.component";
import { ImportacaoService } from "./importacao.service";

@Component({
    selector: 'app-importacao',
    templateUrl: './importacao.component.html',
    styleUrls: ['./importacao.component.css'],
    standalone: true,
    imports: [CommonModule, TituloComponent, SharedModule, FormularioImportacaoComponent]
})

export class ImportacaoComponent implements OnInit, OnDestroy{

  data$!: any;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioImportacaoComponent) child!: FormularioImportacaoComponent;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();
   
  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private importacaoService: ImportacaoService
  ) {}

  ngOnInit(): void {
       //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [1, 'asc'] };

    
  }

  ngOnDestroy(): void {
      
  }

  refresh(data:any){
    //console.log(data)
    this.data$ = data;
    this.dtTrigger.next(this.dtOptions);
  }

  importar(){
    //console.log(this.data$)
  }

  confirm(){
    //console.log(this.data$)
    var importacao:any = {
      dados: this.data$
    }
    this.importacaoService.importar(importacao).subscribe(
      {
        next: (data) => {
          this.sharedService.toast('Sucesso!', "Importação realizada com sucesso.", 3);
          //console.log(data)
          this.data$ = data;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
          });
        },
        error: (error) => {
          //console.log(error)
          this.sharedService.toast('Error!', "Algo errado, tente novamente mais tarde", 2);
        }
      }
    );
  }

  delete(index: number){
      //console.log(data[index])
     this.data$.splice(index, 1)
  }

  testaCPF(strCPF:any) {
    var Soma;
    var Resto;
    Soma = 0;

    if (strCPF == "00000000000" || strCPF == "11111111111" || strCPF == "22222222222" 
    || strCPF == "33333333333" || strCPF == "44444444444"
    || strCPF == "55555555555" || strCPF == "66666666666" || strCPF == "77777777777" 
    || strCPF == "88888888888" || strCPF == "99999999999") return false;

    for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
}

}