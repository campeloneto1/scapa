import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { Orgao, Orgaos } from "../../orgaos/orgaos";
import { OrgaosService } from "../../orgaos/orgaos.service";
import { Setor, Setores } from "../../setores/setores";
import { SetoresService } from "../../setores/setores.service";
import { Funcionario } from "../funcionarios";
import { FuncionariosService } from "../funcionarios.service";

@Component({
    selector: 'app-formulario-funcionarios',
    templateUrl: './formulario-funcionarios.component.html',
    styleUrls: ['./formulario-funcionarios.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class FormularioFuncionariosComponent{

    form!: FormGroup;
    orgaos$!: Observable<Orgaos>;
    setores$!: Observable<Setores>;
    @Output('refresh') refresh: EventEmitter<Funcionario> = new EventEmitter();
  
    protected config!: any
    protected config2!: any
  
    constructor(
      private setoresService: SetoresService,
      private orgaosService: OrgaosService,
      private funcionariosService: FuncionariosService,
      private formBuilder: FormBuilder,
      private sharedService: SharedService,
    ) {}
  
    ngOnInit(): void {
       //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
       this.config = this.sharedService.getConfig();
       this.config = {...this.config, displayFn:(item: Orgao) => { return `${item.nome}`; }, placeholder:'Orgão'};
  
       this.config2 = this.sharedService.getConfig();
       this.config2 = {...this.config, displayFn:(item: Setor) => { return `${item.nome}`; }, placeholder:'Setor'};
  
      this.orgaos$ = this.orgaosService.index();
      //BUILD O FORMULARIO COM VALIDACOES
      this.form = this.formBuilder.group({
        id: [''],
        orgao_id: [''],
        orgao: ['',
        Validators.compose([
          Validators.required,
        ]),],
        setor_id: [''],
        setor: ['',
        Validators.compose([
          Validators.required,
        ]),],
        nome: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(150),
          ]),
        ],
        ramal1: [''],
        ramal2: [''],
       
      });
    }
  
    getSetores(){
      this.setores$ = this.orgaosService.where_setores(this.form.value.orgao.id);
    }
  
  
    //FUNÇÃO CADATRO E EDÇÃO
    cadastrar(){  
      this.form.get('orgao_id')?.patchValue(this.form.value.orgao.id);
      this.form.get('orgao')?.patchValue('');
  
      this.form.get('setor_id')?.patchValue(this.form.value.setor.id);
      this.form.get('setor')?.patchValue('');
  
      this.form.get('evento_id')?.patchValue(this.form.value.evento.id);
      this.form.get('evento')?.patchValue('');
  
      //console.log(this.form.value);
      if(this.form.value.id){
        this.funcionariosService.update(this.form.value).subscribe({
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
      }else{
        this.funcionariosService.store(this.form.value).subscribe({
          next: (data) => {
            //console.log('aaaaaaaaaa')
            this.sharedService.toast('Sucesso!', data as string, 1);
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
    setForm(data: Funcionario){
      this.form.patchValue(data);

      this.form.get('orgao_id')?.patchValue(data.setor.orgao.id);
      this.form.get('orgao')?.patchValue(data.setor.orgao);
      this.form.get('evento')?.patchValue(data.setor);
      this.setores$ = this.orgaosService.where_setores(data.setor.orgao.id || 0);
    }
}