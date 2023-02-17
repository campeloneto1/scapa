import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, tap } from 'rxjs';
import { TituloComponent } from '../../components/titulo/titulo.component';
import { SessionService } from '../../shared/session.service';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { Perfil } from '../perfis/perfis';
import { FormularioSetoresComponent } from './formulario/formulario-setores.component';
import { Setor, Setores } from './setores';
import { SetoresService } from './setores.service';

@Component({
  selector: 'app-setores',
  templateUrl: './setores.component.html',
  styleUrls: ['setores.component.css'],
  standalone: true,
  imports: [CommonModule, TituloComponent, SharedModule, FormularioSetoresComponent],
})
export class SetoresComponent implements OnInit, OnDestroy {
  //VARIAVEL DAS INFORMCAOES DA PAGINA
  data$!: Observable<Setores>;
  excluir!: Setor;
  perfil!: Perfil;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioSetoresComponent) child!: FormularioSetoresComponent;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<Setores>();

  constructor(
    private sharedService: SharedService,
    private sessionService: SessionService,
    private setoresService: SetoresService
  ) {}

  ngOnInit(): void {
    //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [[1, 'asc'],[2, 'asc'] ] };

    this.perfil = this.sessionService.retornaPerfil();

    this.data$ = this.setoresService.index().pipe(
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
    this.data$ = this.setoresService.index().pipe(
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
  edit(data: Setor) {
    this.child.setForm(data);
  }

  //SETA VARIAVEL EXCLUIR COM INFORMACOES DO USUARIO
  delete(data: Setor) {
    this.excluir = data;
  }

  //CONFIRMA A ESCLUSAO DO USUARIO
  confirm(id:number){
    this.setoresService.destroy(id).subscribe({
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
