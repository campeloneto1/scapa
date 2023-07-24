import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { AcessosService } from '../../acessos/acessos.service';
import { Postos } from '../../postos/postos';
import { PostosService } from '../../postos/postos.service';
import { Setores } from '../../setores/setores';
import { SetoresService } from '../../setores/setores.service';
import { Usuarios } from '../../usuarios/usuarios';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { Acesso } from '../acessos';

@Component({
  selector: 'app-formulario-acessos',
  templateUrl: './formulario-acessos.component.html',
  styleUrls: ['./formulario-acessos.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioAcessosCompoennt implements OnInit {
  form!: FormGroup;
  usuarios$!: Observable<Usuarios>;
  setores$!: Observable<Setores>;
  postos$!: Observable<Postos>;
  @Output('refresh') refresh: EventEmitter<Acesso> = new EventEmitter();

  protected config!: any
  protected config2!: any
  protected config3!: any

  constructor(
    private acessosService: AcessosService,
    private postosService: PostosService,
    private setoresService: SetoresService,
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.usuarios$ = this.usuariosService.index();
    this.setores$ = this.setoresService.index();
    this.postos$ = this.postosService.index();

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      setor: ['',[ Validators.required]],
      setor_id: [''],
      posto: ['',[ Validators.required]],
      posto_id: [''],
      user: ['',[ Validators.required]],
      user_id: [''],
      data_hora: [''],
      obs: [''],
    });
  }

  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    // this.form.get('setor_id')?.patchValue(this.form.value.setor.id);
    // this.form.get('setor')?.patchValue('');

    // this.form.get('posto_id')?.patchValue(this.form.value.posto.id);
    // this.form.get('posto')?.patchValue('');

    // this.form.get('user_id')?.patchValue(this.form.value.user.id);
    // this.form.get('user')?.patchValue('');


    //console.log(this.form.value);
    if(this.form.value.id){
      this.acessosService.update(this.form.value).subscribe({
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
      this.acessosService.store(this.form.value).subscribe({
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
  setForm(data: Acesso){
    this.form.patchValue(data);
  }
}
