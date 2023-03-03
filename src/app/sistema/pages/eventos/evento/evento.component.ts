import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { Evento } from "../eventos";
import { EventosService } from "../eventos.service";
import { environment } from "src/environments/environments";
import { Pessoa, Pessoas } from "../../pessoas/pessoas";
import { PessoasService } from "../../pessoas/pessoas.service";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { EventosPessoasService } from "../eventos-pessoas.service";
import { EventoPessoa } from "../eventos-pessoas";
import { FormularioPessoasCompoennt } from "../../pessoas/formulario/formulario-pessoas.component";


@Component({
    selector: 'app-evento',
    templateUrl: './evento.component.html',
    styleUrls: ['./evento.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent, FormularioPessoasCompoennt]
})

export class EventoComponent implements OnInit{
    id!: number;
    evento$!: Observable<Evento>;
    pessoas$!: Observable<Pessoas>;
    excluir!: Pessoa;
    urlimage = environment.image;
    pessoas!: Pessoas;
    cadastro: boolean = false;

    protected config!: any

    constructor(
        private activatedRoute: ActivatedRoute,
        private sharedService: SharedService,
        private eventosService: EventosService,
        private eventosPessoasService: EventosPessoasService,
        private pessoasService: PessoasService
    ){

    }
    ngOnInit(): void {
        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        this.config = this.sharedService.getConfig();
        this.config = {...this.config, displayFn:(item: Pessoa) => { return `${item.nome} (${item.cpf})`; }, placeholder:'Pessoas'};

        this.id = this.activatedRoute.snapshot.params['id'];
        this.evento$ = this.eventosService.show(this.id);

        this.pessoas$ = this.pessoasService.index();
    }

    refresh(){
      this.pessoas$ = this.pessoasService.index(); 
  }

    refresh2(){
        this.evento$ = this.eventosService.show(this.id);  
    }

    adicionar(id: number){
        
        var obj = {evento: id, pessoas: this.pessoas};
        this.eventosPessoasService.store(obj).subscribe({
            next: (data) => {
              //console.log('aaaaaaaaaa')
              this.sharedService.toast('Sucesso!', data as string, 1);
                this.refresh2();
            },
            error: (error) => {
              this.sharedService.toast('Error!', error.error.erro as string, 2);
            }
          })

        //console.log(obj);
    }

    presente(id?: number){
        this.eventosPessoasService.presente(id).subscribe({
            next: (data) => {
                this.sharedService.toast('Sucesso!', data as string, 3);
                this.refresh2();
              },
              error: (error) => {
                this.sharedService.toast('Error!', error.erro as string, 2);
              }
        });
    }

    delete(data: Pessoa){
        this.excluir = data;
    }

    confirm(){
        this.eventosPessoasService.destroy(this.excluir.pivot.id).subscribe({
            next: (data) => {
                this.sharedService.toast('Sucesso!', data as string, 3);
                this.refresh2();
              },
              error: (error) => {
                this.sharedService.toast('Error!', error.erro as string, 2);
              }
        });
    }
}