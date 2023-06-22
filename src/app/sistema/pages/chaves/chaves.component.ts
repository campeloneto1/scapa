import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormularioChavesComponent } from "./formulario/formulario-chaves.component";
import { SharedModule } from "../../shared/shared.module";
import { TituloComponent } from "../../components/titulo/titulo.component";
import { Observable, Subject, tap } from "rxjs";
import { Chave, Chaves } from "./chaves";
import { DataTableDirective } from 'angular-datatables';
import { ChavesService } from "./chaves.service";
import { SharedService } from "../../shared/shared.service";
import { FormularioReceberChavesComponent } from "./formulario-receber/formulario-receber-chaves.component";
import { Perfil } from "../perfis/perfis";
import { SessionService } from "../../shared/session.service";

@Component({
    selector: 'app-chaves',
    templateUrl: './chaves.component.html',
    styleUrls: ['./chaves.component.css'],
    standalone: true,
    imports: [CommonModule, TituloComponent, SharedModule, FormularioChavesComponent, FormularioReceberChavesComponent]
})

export class ChavesComponent implements OnInit, OnDestroy{
     //VARIAVEL DAS INFORMCAOES DA PAGINA
  data$!: Observable<Chaves>;
  excluir!: Chave;
  perfil!: Perfil;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioChavesComponent) child!: FormularioChavesComponent;
  @ViewChild(FormularioReceberChavesComponent) childreceber!: FormularioReceberChavesComponent;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<Chaves>();

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private chavesService: ChavesService
  ) {}

  ngOnInit(): void {
    //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [0, 'desc'] };

    this.perfil = this.sessionService.retornaPerfil();

    this.data$ = this.chavesService.index().pipe(
      tap(() => {
        this.dtTrigger.next(this.dtOptions);
      })
    );
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  refresh() {
    this.data$ = this.chavesService.index().pipe(
      tap(() => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.dtOptions);
        });
      })
    );

    /*
     
    */
  }

  /*
  paginate(url: string){
   this.data$ = this.estadosService.paginate(url);
  }*/

  //RECEBE CHAVES
  receber(data: Chave){
    this.childreceber.setForm(data);
  }

  //SETA INFORMACAO NO FORMULARIO CHILD
  edit(data: Chave) {
    this.child.setForm(data);
  }

  //SETA VARIAVEL EXCLUIR COM INFORMACOES DO USUARIO
  delete(data: Chave) {
    this.excluir = data;
  }

  //CONFIRMA A ESCLUSAO DO USUARIO
  confirm(id:number){
    this.chavesService.destroy(id).subscribe({
      next: (data) => {
        this.sharedService.toast('Sucesso!', data as string, 3);
        this.refresh();
      },
      error: (error) => {
        this.sharedService.toast('Error!', error.erro as string, 2);
      }
    })
  }
}