import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, tap } from 'rxjs';
import { TituloComponent } from '../../components/titulo/titulo.component';
import { SessionService } from '../../shared/session.service';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { FormularioAutoridadesAcessosComponent } from './formulario/formulario-autoridades-acessos.component';
import { AutoridadeAcesso, AutoridadesAcessos } from './autoridades-acessos';
import { AutoridadesAcessosService } from './autoridades-acessos.service';
import { Perfil } from "../perfis/perfis";

@Component({
  selector: 'app-autoridades-acessos',
  templateUrl: './autoridades-acessos.component.html',
  styleUrls: ['autoridades-acessos.component.css'],
  standalone: true,
  imports: [CommonModule, TituloComponent, SharedModule, FormularioAutoridadesAcessosComponent],
})
export class AutoridadesAcessosComponent implements OnInit, OnDestroy {
  //VARIAVEL DAS INFORMCAOES DA PAGINA
  data$!: Observable<AutoridadesAcessos>;
  excluir!: AutoridadeAcesso;
  autSaida!: AutoridadeAcesso;
  perfil!: Perfil;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioAutoridadesAcessosComponent) child!: FormularioAutoridadesAcessosComponent;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<AutoridadesAcessos>();

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private autoridadesAcessosService: AutoridadesAcessosService
  ) {}

  ngOnInit(): void {
    //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [0, 'desc'] };

    this.perfil = this.sessionService.retornaPerfil();

    this.data$ = this.autoridadesAcessosService.index().pipe(
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
    this.data$ = this.autoridadesAcessosService.index().pipe(
      tap(() => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next(this.dtOptions);
        });
      })
    );
  }

  //SETA INFORMACAO NO FORMULARIO CHILD
  edit(data: AutoridadeAcesso) {
    this.child.setForm(data);
  }

  //SETA VARIAVEL EXCLUIR COM INFORMACOES DO USUARIO
  delete(data: AutoridadeAcesso) {
    this.excluir = data;
  }

  //CONFIRMA A ESCLUSAO DO USUARIO
  confirm(id:number){
    this.autoridadesAcessosService.destroy(id).subscribe({
      next: (data) => {
        this.sharedService.toast('Sucesso!', data as string, 3);
        this.refresh();
      },
      error: (error) => {
        this.sharedService.toast('Error!', error.erro as string, 2);
      }
    })
  }

  saida(data: AutoridadeAcesso){
    this.autSaida = data;
  }

   //CONFIRMA A saida Da autoridade
   confirmSaida(){
    this.autoridadesAcessosService.saida(this.autSaida).subscribe({
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
