import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { EstadosService } from '../../estados/estados.service';
import { Pais, Paises } from '../../paises/paises';
import { Estado } from '../estados';

@Component({
  selector: 'app-formulario-estados',
  templateUrl: './formulario-estados.component.html',
  styleUrls: ['./formulario-estados.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioEstadosCompoennt implements OnInit {
  form!: FormGroup;
  paises$!: Observable<Paises>;
  @Output('refresh') refresh: EventEmitter<Estado> = new EventEmitter();

  //protected config!: any

  constructor(
    private estadosService: EstadosService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.paises$ = this.sharedService.getPaises();

    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    // this.config = this.sharedService.getConfig();
    // this.config = {...this.config, displayFn:(item: Pais) => { return `${item.nome}`; }, placeholder:'País'};

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      pais: [
        ''
      ],
      pais_id: ['',
      [Validators.required]],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(150),
        ]),
      ],
      uf: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(5),
        ]),
      ],
    });
  }


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    // this.form.get('pais_id')?.patchValue(this.form.value.pais.id);
    // this.form.get('pais')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.estadosService.update(this.form.value).subscribe({
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
      this.estadosService.store(this.form.value).subscribe({
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
  setForm(data: Estado){
    this.form.patchValue(data);
  }
}
