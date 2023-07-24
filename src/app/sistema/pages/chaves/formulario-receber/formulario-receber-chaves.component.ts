import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { Setor, Setores } from "../../setores/setores";
import { Chave } from "../chaves";
import { ChavesService } from "../chaves.service";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { SetoresService } from "../../setores/setores.service";
import { Funcionario, Funcionarios } from "../../funcionarios/funcionarios";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { FuncionariosService } from "../../funcionarios/funcionarios.service";

@Component({
    selector: 'app-formulario-receber-chaves',
    templateUrl: './formulario-receber-chaves.component.html',
    styleUrls: ['./formulario-receber-chaves.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class FormularioReceberChavesComponent implements OnInit, OnDestroy{
    form!: FormGroup;
    funcionarios$!: Observable<Funcionarios>;
    @Output('refresh') refresh: EventEmitter<Chave> = new EventEmitter();

    protected config!: any

    constructor(
        private chavesService: ChavesService,
        private setoresService: SetoresService,
        private funcionariosService: FuncionariosService,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
    ){

    }

    ngOnInit(): void {
        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        this.config = this.sharedService.getConfig();
        this.config = {...this.config, height: '400px', displayFn:(item: Funcionario) => { return `${item.nome} (${item.setor.nome})`; }, placeholder:'Funcionário'};

      
        //this.funcionarios$ = this.funcionariosService.index();

        this.funcionariosService.index().subscribe(
          {
            next: (data) => {
              data.forEach((funcionario) => {
                funcionario.nome = `${funcionario.nome} (${funcionario.setor.nome})`;
              });
              this.funcionarios$ = of(data);
            },
            error: (error) => {
  
            }
          }
        );

        //BUILD O FORMULARIO COM VALIDACOES
        this.form = this.formBuilder.group({
        id: [''],
        setor_id: [
            '',
        ],
        setor: [
            '',
          
        ],
        funcionario_devolucao_id: [
            '',
            [Validators.required],
        ],
        funcionario_devolucao: [
            '',
            
        ],
        obs: [
            '',
            Validators.compose([
            Validators.maxLength(150),
            ]),
        ],
        
        });
    }

    ngOnDestroy(): void {
        
    }

    getFuncionarios(){
      this.funcionarios$ = of([]);
      this.funcionarios$ = this.setoresService.where(this.form.value.setor.id);
  }

     //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    //this.form.get('funcionario_devolucao_id')?.patchValue(this.form.value.funcionario_devolucao.id);
    //this.form.get('funcionario_devolucao')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.chavesService.receber(this.form.value).subscribe({
        next: (data) => {
          //console.log('aaaaaaaaaa')
          this.sharedService.toast('Sucesso!', data as string, 3);
          this.form.reset();
          this.refresh.emit();
        },
        error: (error) => {
          this.sharedService.toast('Error!', error.erro as string, 2);
        }
      });
    }
  }

  //FUNÇÃO SETA INFORMACAO NO FORMULARIO
  setForm(data: Chave){
    this.form.patchValue(data);

    //this.getFuncionarios();
  }

}