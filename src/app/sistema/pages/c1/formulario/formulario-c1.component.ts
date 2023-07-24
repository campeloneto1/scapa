import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { C1Service } from '../../c1/c1.service';
import { C1 } from '../c1';
import { Graduacao, Graduacoes } from '../../graduacoes/graduacoes';
import { Observable } from 'rxjs';
import { GraduacoesService } from '../../graduacoes/graduacoes.service';

@Component({
  selector: 'app-formulario-c1',
  templateUrl: './formulario-c1.component.html',
  styleUrls: ['./formulario-c1.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioC1Component implements OnInit {
  form!: FormGroup;
  graduacoes$!: Observable<Graduacoes>;
  @Output('refresh') refresh: EventEmitter<C1> = new EventEmitter();

  //protected config!: any

  constructor(
    private c1Service: C1Service,
    private graduacoesService: GraduacoesService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
     //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    //  this.config = this.sharedService.getConfig();
    //  this.config = {...this.config, displayFn:(item: Graduacao) => { return `${item.nome}`; }, placeholder:'Graduação'};


    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      graduacao: [
        '',        
      ],
      graduacao_id: [
        '',       
      ],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
        ]),
      ],
      nome_guerra: [
        '',
        Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      ],
      apelido: [
        '',
        Validators.compose([
          Validators.minLength(2),
          Validators.maxLength(50),
        ]),
      ],
      telefone1: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
        ]),
      ],
      telefone2: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(11),
        ]),
      ],
      telefone3: [
        '',
        Validators.compose([
          Validators.minLength(10),
          Validators.maxLength(11),
        ]),
      ],
      obs: [
        '',
      ],
    });


    this.graduacoes$ = this.graduacoesService.index();
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    // if(this.form.value.graduacao){
    //   this.form.get('graduacao_id')?.patchValue(this.form.value.graduacao.id);
    // this.form.get('graduacao')?.patchValue('');
    // }
    

    //console.log(this.form.value);
    if(this.form.value.id){
      this.c1Service.update(this.form.value).subscribe({
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
      this.c1Service.store(this.form.value).subscribe({
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
  setForm(data: C1){
    this.form.patchValue(data);
  }
}
