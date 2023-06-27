import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { AutoridadeAcesso } from '../autoridades-acessos';
import { Autoridade, Autoridades } from '../../autoridades/autoridades';
import { AutoridadesAcessosService } from '../autoridades-acessos.service';
import { AutoridadesService } from '../../autoridades/autoridades.service';

@Component({
  selector: 'app-formulario-autoridades-acessos',
  templateUrl: './formulario-autoridades-acessos.component.html',
  styleUrls: ['./formulario-autoridades-acessos.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioAutoridadesAcessosComponent implements OnInit {
  form!: FormGroup;
  autoridades$!: Observable<Autoridades>;
  @Output('refresh') refresh: EventEmitter<AutoridadeAcesso> = new EventEmitter();

  protected config!: any

  constructor(
    private autoridadesAcessosService: AutoridadesAcessosService,
    private autoridadesService: AutoridadesService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.autoridades$ = this.autoridadesService.index();

    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    this.config = this.sharedService.getConfig();
    this.config = {...this.config, displayFn:(item: Autoridade) => { return `${item.nome}`; }, placeholder:'Autoridade'};

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      autoridade: [
        '',
        [Validators.required],
      ],
      autoridade_id: [''],
      tipo: [
        '',
        [
          Validators.required,
        ],
      ],     
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    this.form.get('autoridade_id')?.patchValue(this.form.value.autoridade.id);
    this.form.get('autoridade')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.autoridadesAcessosService.update(this.form.value).subscribe({
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
      this.autoridadesAcessosService.store(this.form.value).subscribe({
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
  setForm(data: AutoridadeAcesso){
    this.form.patchValue(data);
  }
}
