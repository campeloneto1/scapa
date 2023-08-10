import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { AutoridadeAcesso } from '../autoridades-acessos';
import { AutoridadesAcessosService } from '../autoridades-acessos.service';

@Component({
  selector: 'app-formulario-autoridades-acessos-saida',
  templateUrl: './formulario-autoridades-acessos-saida.component.html',
  styleUrls: ['./formulario-autoridades-acessos-saida.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioAutoridadesAcessosSaidaComponent implements OnInit {
  form!: FormGroup;
  @Output('refresh') refresh: EventEmitter<AutoridadeAcesso> = new EventEmitter();

  protected config!: any

  constructor(
    private autoridadesAcessosService: AutoridadesAcessosService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      autoridade: [
        ''
      ],
      obs: [
        ''
      ],
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
   
      this.autoridadesAcessosService.saida(this.form.value).subscribe({
        next: (data) => {
          this.sharedService.toast('Sucesso!', data as string, 3);
          this.form.reset();
          this.refresh.emit();
        },
        error: (error) => {
          this.sharedService.toast('Error!', error.error.erro as string, 2);
        }
      });
    
  }

  //FUNÇÃO SETA INFORMACAO NO FORMULARIO
  setForm(data: AutoridadeAcesso){
    
    this.form.patchValue(data);
    //console.log(this.form.value);
  }
}
