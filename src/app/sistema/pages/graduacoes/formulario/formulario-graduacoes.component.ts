import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { GraduacoesService } from '../../graduacoes/graduacoes.service';
import { Graduacao } from '../graduacoes';

@Component({
  selector: 'app-formulario-graduacoes',
  templateUrl: './formulario-graduacoes.component.html',
  styleUrls: ['./formulario-graduacoes.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioGraduacoesComponent implements OnInit {
  form!: FormGroup;
  @Output('refresh') refresh: EventEmitter<Graduacao> = new EventEmitter();

  constructor(
    private graduacoesService: GraduacoesService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
        ]),
      ],
      abreviatura: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
      ],
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    //console.log(this.form.value);
    if(this.form.value.id){
      this.graduacoesService.update(this.form.value).subscribe({
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
      this.graduacoesService.store(this.form.value).subscribe({
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
  setForm(data: Graduacao){
    this.form.patchValue(data);
  }
}
