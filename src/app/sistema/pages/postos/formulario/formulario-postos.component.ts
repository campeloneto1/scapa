import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';
import { Orgao, Orgaos } from '../../orgaos/orgaos';
import { OrgaosService } from '../../orgaos/orgaos.service';

import { PostosService } from '../../postos/postos.service';
import { Posto } from '../postos';

@Component({
  selector: 'app-formulario-postos',
  templateUrl: './formulario-postos.component.html',
  styleUrls: ['./formulario-postos.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioPostosComponent implements OnInit {
  form!: FormGroup;
  orgaos$!: Observable<Orgaos>;
  @Output('refresh') refresh: EventEmitter<Posto> = new EventEmitter();

  protected config!: any

  constructor(
    private postosService: PostosService,
    private orgaosService: OrgaosService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
     //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
     this.config = this.sharedService.getConfig();
     this.config = {...this.config, displayFn:(item: Orgao) => { return `${item.nome}`; }, placeholder:'Orgão'};

    this.orgaos$ = this.orgaosService.index();
    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      orgao_id: [''],
      orgao: ['',
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
      telefone1: [''],
      telefone2: [''],
      email: [''],
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    this.form.get('orgao_id')?.patchValue(this.form.value.orgao.id);
    this.form.get('orgao')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.postosService.update(this.form.value).subscribe({
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
      this.postosService.store(this.form.value).subscribe({
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
  setForm(data: Posto){
    this.form.patchValue(data);
  }
}
