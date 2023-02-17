import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, tap } from 'rxjs';
import { TituloComponent } from '../../components/titulo/titulo.component';
import { SessionService } from '../../shared/session.service';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { Perfil } from '../perfis/perfis';
import { FormularioPostosComponent } from './formulario/formulario-postos.component';
import { Posto, Postos } from './postos';
import { PostosService } from './postos.service';

@Component({
  selector: 'app-postos',
  templateUrl: './postos.component.html',
  styleUrls: ['postos.component.css'],
  standalone: true,
  imports: [CommonModule, TituloComponent, SharedModule, FormularioPostosComponent],
})
export class PostosComponent implements OnInit, OnDestroy {
  //VARIAVEL DAS INFORMCAOES DA PAGINA
  data$!: Observable<Postos>;
  excluir!: Posto;
  perfil!: Perfil;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioPostosComponent) child!: FormularioPostosComponent;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<Postos>();

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private postosService: PostosService
  ) {}

  ngOnInit(): void {
    //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [[1, 'asc'],[2, 'asc'] ]};

    this.perfil = this.sessionService.retornaPerfil();

    this.data$ = this.postosService.index().pipe(
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
    this.data$ = this.postosService.index().pipe(
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
  edit(data: Posto) {
    this.child.setForm(data);
  }

  //SETA VARIAVEL EXCLUIR COM INFORMACOES DO USUARIO
  delete(data: Posto) {
    this.excluir = data;
  }

  //CONFIRMA A ESCLUSAO DO USUARIO
  confirm(id:number){
    this.postosService.destroy(id).subscribe({
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
