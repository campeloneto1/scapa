import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, tap } from 'rxjs';
import { TituloComponent } from '../../components/titulo/titulo.component';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { FormularioAcessosCompoennt } from './formulario/formulario-acessos.component';
import { Acesso, Acessos } from './acessos';
import { AcessosService } from './acessos.service';
import { Perfil } from '../perfis/perfis';
import { SessionService } from '../../shared/session.service';

@Component({
  selector: 'app-acessos',
  templateUrl: './acessos.component.html',
  styleUrls: ['acessos.component.css'],
  standalone: true,
  imports: [CommonModule, TituloComponent, SharedModule, FormularioAcessosCompoennt],
})
export class AcessosComponent implements OnInit, OnDestroy {
  //VARIAVEL DAS INFORMCAOES DA PAGINA
  data$!: Observable<Acessos>;
  excluir!: Acesso;
  perfil!: Perfil;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioAcessosCompoennt) child!: FormularioAcessosCompoennt;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<Acessos>();

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private acessosService: AcessosService
  ) {}

  ngOnInit(): void {
    //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [0, 'desc'] };

    this.perfil = this.sessionService.retornaPerfil();

    this.data$ = this.acessosService.index().pipe(
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
    this.data$ = this.acessosService.index().pipe(
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
  edit(data: Acesso) {
    this.child.setForm(data);
  }

  //SETA VARIAVEL EXCLUIR COM INFORMACOES DO USUARIO
  delete(data: Acesso) {
    this.excluir = data;
  }

  //CONFIRMA A ESCLUSAO DO USUARIO
  confirm(id:number){
    this.acessosService.destroy(id).subscribe({
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
