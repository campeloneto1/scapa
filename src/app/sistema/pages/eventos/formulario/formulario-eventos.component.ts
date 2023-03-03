import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';
import { Orgao, Orgaos } from '../../orgaos/orgaos';
import { OrgaosService } from '../../orgaos/orgaos.service';
import { SetoresService } from '../../setores/setores.service';
import { EventosService } from '../eventos.service';
import { Evento } from '../eventos';
import { Setor, Setores } from '../../setores/setores';

@Component({
  selector: 'app-formulario-eventos',
  templateUrl: './formulario-eventos.component.html',
  styleUrls: ['./formulario-eventos.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioEventosComponent implements OnInit {
  form!: FormGroup;
  orgaos$!: Observable<Orgaos>;
  setores$!: Observable<Setores>;
  @Output('refresh') refresh: EventEmitter<Evento> = new EventEmitter();

  protected config!: any
  protected config2!: any

  constructor(
    private setoresService: SetoresService,
    private orgaosService: OrgaosService,
    private eventosService: EventosService,
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
      data_hora: ['',
      Validators.compose([
        Validators.required,
      ]),],
      obs: [''],
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
      this.eventosService.update(this.form.value).subscribe({
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
      this.eventosService.store(this.form.value).subscribe({
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
  setForm(data: Evento){
    this.form.get('orgao_id')?.patchValue(data.setor.orgao.id);
    this.form.get('orgao')?.patchValue(data.setor.orgao);
    this.form.get('evento')?.patchValue(data.setor);
    this.setores$ = this.orgaosService.where_setores(data.setor.orgao.id || 0);

    this.form.patchValue(data);
  }
}
