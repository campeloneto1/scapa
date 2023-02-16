import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { NiveisService } from '../../niveis/niveis.service';
import { Orgao, Orgaos } from '../../orgaos/orgaos';
import { OrgaosService } from '../../orgaos/orgaos.service';
import { Nivel } from '../niveis';

@Component({
  selector: 'app-formulario-niveis',
  templateUrl: './formulario-niveis.component.html',
  styleUrls: ['./formulario-niveis.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioNiveisCompoennt implements OnInit {
  form!: FormGroup;
  orgaos$!: Observable<Orgaos>;
  @Output('refresh') refresh: EventEmitter<Nivel> = new EventEmitter();

  protected config!: any
  
  constructor(
    private niveisService: NiveisService,
    private orgaosService: OrgaosService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.orgaos$ = this.orgaosService.index();
    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    this.config = this.sharedService.getConfig();
    this.config = {...this.config, displayFn:(item: Orgao) => { return `${item.nome}`; }, placeholder:'Orgão'};


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
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    this.form.get('orgao_id')?.patchValue(this.form.value.orgao.id);
    this.form.get('orgao')?.patchValue('');
    //console.log(this.form.value);
    if(this.form.value.id){
      this.niveisService.update(this.form.value).subscribe({
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
      this.niveisService.store(this.form.value).subscribe({
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
  setForm(data: Nivel){
    this.form.patchValue(data);
  }
}
