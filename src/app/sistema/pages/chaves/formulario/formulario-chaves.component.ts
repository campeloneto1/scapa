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
    selector: 'app-formulario-chaves',
    templateUrl: './formulario-chaves.component.html',
    styleUrls: ['./formulario-chaves.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class FormularioChavesComponent implements OnInit, OnDestroy{
    form!: FormGroup;
    setores$!: Observable<Setores>;
    funcionarios$!: Observable<Funcionarios>;
    @Output('refresh') refresh: EventEmitter<Chave> = new EventEmitter();

    // protected config!: any
    // protected config2!: any

    constructor(
        private chavesService: ChavesService,
        private setoresService: SetoresService,
        private funcionariosService: FuncionariosService,
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
    ){

    }

    ngOnInit(): void {
        this.setores$ = this.setoresService.index();
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

        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        // this.config = this.sharedService.getConfig();
        // this.config = {...this.config, displayFn:(item: Setor) => { return `${item.nome}`; }, placeholder:'Setor'};

        // this.config2 = this.sharedService.getConfig();
        // this.config2 = {...this.config, displayFn:(item: Funcionario) => { return `${item.nome} (${item.setor.nome})`; }, placeholder:'Funcionário'};

      
        //BUILD O FORMULARIO COM VALIDACOES
        this.form = this.formBuilder.group({
        id: [''],
        setor_id: [
            '',
            [Validators.required],
        ],
        setor: [
            ''
        ],
        funcionario_entrega_id: [
            '',
            [Validators.required],
        ],
        funcionario_entrega: [
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
      this.funcionarios$ = this.setoresService.where(this.form.value.setor_id);
  }

     //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    // this.form.get('funcionario_entrega_id')?.patchValue(this.form.value.funcionario_entrega_id);
    // this.form.get('funcionario_entrega')?.patchValue('');

    //this.form.get('setor_id')?.patchValue(this.form.value.setor.id);
    //this.form.get('setor')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.chavesService.update(this.form.value).subscribe({
        next: (data) => {
          //console.log('aaaaaaaaaa')
          this.sharedService.toast('Sucesso!', data as string, 3);
          this.form.reset();
          this.refresh.emit();
        },
        error: (error) => {
          this.sharedService.toast('Error!', error.error.erro as string, 2);
        }
      });
    }else{
      this.chavesService.store(this.form.value).subscribe({
        next: (data) => {
          //console.log('aaaaaaaaaa')
          this.sharedService.toast('Sucesso!', data as string, 1);
          this.form.reset();
          this.refresh.emit();
        },
        error: (error) => {
          this.sharedService.toast('Error!', error.error.erro as string, 2);
        }
      });
    }
  }

  //FUNÇÃO SETA INFORMACAO NO FORMULARIO
  setForm(data: Chave){
    this.form.patchValue(data);

    this.getFuncionarios();
  }

}