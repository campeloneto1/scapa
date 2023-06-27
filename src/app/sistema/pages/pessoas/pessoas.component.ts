import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, of, tap } from 'rxjs';
import { TituloComponent } from '../../components/titulo/titulo.component';
import { SessionService } from '../../shared/session.service';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { Perfil } from '../perfis/perfis';
import { FormularioPessoasCompoennt } from './formulario/formulario-pessoas.component';
import { Pessoa, Pessoas } from './pessoas';
import { PessoasService } from './pessoas.service';
import { environment } from 'src/environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  styleUrls: ['pessoas.component.css'],
  standalone: true,
  imports: [CommonModule, TituloComponent, SharedModule, FormularioPessoasCompoennt],
})
export class PessoasComponent implements OnInit, OnDestroy {
  //VARIAVEL DAS INFORMCAOES DA PAGINA
  data$!: Observable<Pessoas>;
  excluir!: Pessoa;
  foto!: Pessoa;
  perfil!: Perfil;
  url: string = environment.image;
  search!: string;

  //VARIAVEL DE CONFIGURACOES DA TABLEA
  dtOptions: DataTables.Settings = {};


  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  @ViewChild(FormularioPessoasCompoennt) child!: FormularioPessoasCompoennt;

  @ViewChild('fecharmodalcadastro') closebuttoncadastro: any;

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<Pessoas>();

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private sessionService: SessionService,
    private pessoasService: PessoasService
  ) {}

  ngOnInit(): void {
    //PEGA AS CONFIGURACOES DA TABELA E ADICIONA A ORDENACAO PELA COLUNA
    this.dtOptions = this.sharedService.getDtOptions();
    this.dtOptions = { ...this.dtOptions, order: [[1, 'asc'],[2, 'asc'] ] };

    this.perfil = this.sessionService.retornaPerfil();
    this.data$ = of([]);
    /*this.data$ = this.pessoasService.index().pipe(
      tap(() => {
        this.dtTrigger.next(this.dtOptions);
      })
    );*/
   
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  refresh() {
    this.closebuttoncadastro.nativeElement.click();
    this.data$ = this.pessoasService.index().pipe(
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

  searchpessoa(){
    //console.log(this.search);
    //this.pessoasService.searchPessoa(this.search)
    if(this.dtElement.dtInstance){
      this.data$ = this.pessoasService.searchPessoa(this.search).pipe(
        tap(() => {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next(this.dtOptions);
            
          });
        })
      );
    }else{
      this.data$ = this.pessoasService.searchPessoa(this.search).pipe(
        tap(() => {
          this.dtTrigger.next(this.dtOptions);
        })
      );
    }
   
  }

  //SETA INFORMACAO NO FORMULARIO CHILD
  edit(data: Pessoa) {
    this.child.setForm(data);
  }

  //SETA VARIAVEL EXCLUIR COM INFORMACOES DO USUARIO
  delete(data: Pessoa) {
    this.excluir = data;
  }

  //CONFIRMA A ESCLUSAO DO USUARIO
  confirm(id:number){
    this.pessoasService.destroy(id).subscribe({
      next: (data) => {
        this.sharedService.toast('Sucesso!', data as string, 3);
        this.refresh();
      },
      error: (error) => {
        this.sharedService.toast('Error!', error.error.erro as string, 2);
      }
    })
  }

  showFoto(data: Pessoa){
    this.foto = data;
  }

  fileEvent(e: any){
    var filedata = e.target.files[0];
    //console.log(this.filedata);

    var myFormData = new FormData();
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      myFormData.append('image', filedata);
      myFormData.append('id', this.foto?.id+'');
      /* Image Post Request */
      this.http.post(`${environment.url}/upload-foto2`, myFormData, {
      headers: headers
      }).subscribe({
        next: data => {       
            this.pessoasService.show(this.foto.id || 0).subscribe(data => {
              this.foto = data;
            })
            this.refresh();
            this.sharedService.toast('Sucesso!', data as string, 3);          
         },
         error: (error) => {
          console.log(error)
           this.sharedService.toast('Error!', error.error.erro as string, 4);
         }
      });  
  }

}
