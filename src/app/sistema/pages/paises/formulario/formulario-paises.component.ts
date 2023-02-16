import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { PaisesService } from '../../paises/paises.service';
import { Pais } from '../paises';

@Component({
  selector: 'app-formulario-paises',
  templateUrl: './formulario-paises.component.html',
  styleUrls: ['./formulario-paises.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioPaisesComponent implements OnInit {
  form!: FormGroup;
  @Output('refresh') refresh: EventEmitter<Pais> = new EventEmitter();


  constructor(
    private paisesService: PaisesService,
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
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    //console.log(this.form.value);
    if(this.form.value.id){
      this.paisesService.update(this.form.value).subscribe({
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
      this.paisesService.store(this.form.value).subscribe({
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
  setForm(data: Pais){
    this.form.patchValue(data);
  }
}
