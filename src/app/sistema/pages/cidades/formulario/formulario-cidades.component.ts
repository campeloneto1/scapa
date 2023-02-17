import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { CidadesService } from '../../cidades/cidades.service';
import { Estados } from '../../estados/estados';
import { Pais, Paises } from '../../paises/paises';
import { Cidade } from '../cidades';

@Component({
  selector: 'app-formulario-cidades',
  templateUrl: './formulario-cidades.component.html',
  styleUrls: ['./formulario-cidades.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioCidadesCompoennt implements OnInit {
  form!: FormGroup;
  paises$!: Observable<Paises>;
  estados$!: Observable<Estados>;
  @Output('refresh') refresh: EventEmitter<Cidade> = new EventEmitter();

  protected config!: any
  protected config2!: any

  constructor(
    private cidadesService: CidadesService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.paises$ = this.sharedService.getPaises();

    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    this.config = this.sharedService.getConfig();
    this.config = {...this.config, displayFn:(item: Pais) => { return `${item.nome}`; }, placeholder:'País'};

    this.config2 = this.sharedService.getConfig();
    this.config2 = {...this.config, displayFn:(item: Pais) => { return `${item.nome}`; }, placeholder:'Estado'};

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      pais: [
        '',
        [Validators.required],
      ],
      pais_id: [''],
      estado: [
        '',
        [Validators.required],
      ],
      estado_id: [''],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
        ]),
      ],
     
    });
  }

  getEstados(){
    if(this.form.value.pais){
     this.estados$ = this.sharedService.getEstados(this.form.value.pais.id);
    }
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    this.form.get('pais_id')?.patchValue(this.form.value.pais.id);
    this.form.get('pais')?.patchValue('');

    this.form.get('estado_id')?.patchValue(this.form.value.estado.id);
    this.form.get('estado')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.cidadesService.update(this.form.value).subscribe({
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
      this.cidadesService.store(this.form.value).subscribe({
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
  setForm(data: Cidade){
    
    this.form.patchValue(data);
    this.form.get('pais')?.patchValue(data.estado.pais)
  }
}
