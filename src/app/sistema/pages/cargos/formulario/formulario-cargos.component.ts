import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { CargosService } from '../../cargos/cargos.service';
import { Cargo } from '../cargos';

@Component({
  selector: 'app-formulario-cargos',
  templateUrl: './formulario-cargos.component.html',
  styleUrls: ['./formulario-cargos.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioCargosCompoennt implements OnInit {
  form!: FormGroup;
  @Output('refresh') refresh: EventEmitter<Cargo> = new EventEmitter();

  constructor(
    private cargosService: CargosService,
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
      this.cargosService.update(this.form.value).subscribe({
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
      this.cargosService.store(this.form.value).subscribe({
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
  setForm(data: Cargo){
    this.form.patchValue(data);
  }
}
