import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { PerfisService } from '../../perfis/perfis.service';
import { Perfil } from '../perfis';

@Component({
  selector: 'app-formulario-perfis',
  templateUrl: './formulario-perfis.component.html',
  styleUrls: ['./formulario-perfis.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioPerfisComponent implements OnInit {
  form!: FormGroup;
  @Output('refresh') refresh: EventEmitter<Perfil> = new EventEmitter();


  constructor(
    private perfisService: PerfisService,
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
      administrador: [''],
      gestor: [''],
      
      acessos: [''],
      acessos_cad: [''],
      acessos_edt: [''],
      acessos_del: [''],

      eventos: [''],
      eventos_cad: [''],
      eventos_edt: [''],
      eventos_del: [''],

      orgaos: [''],
      orgaos_cad: [''],
      orgaos_edt: [''],
      orgaos_del: [''],

      setores: [''],
      setores_cad: [''],
      setores_edt: [''],
      setores_del: [''],

      postos: [''],
      postos_cad: [''],
      postos_edt: [''],
      postos_del: [''],

      pessoas: [''],
      pessoas_cad: [''],
      pessoas_edt: [''],
      pessoas_del: [''],

      niveis: [''],
      niveis_cad: [''],
      niveis_edt: [''],
      niveis_del: [''],
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    //console.log(this.form.value);
    if(this.form.value.id){
      this.perfisService.update(this.form.value).subscribe({
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
      this.perfisService.store(this.form.value).subscribe({
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
  setForm(data: Perfil){
    this.form.patchValue(data);
  }
}
