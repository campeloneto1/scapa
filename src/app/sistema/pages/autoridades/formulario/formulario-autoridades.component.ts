import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';

import { AutoridadesService } from '../../autoridades/autoridades.service';
import { Autoridade } from '../autoridades';
import { Cargo, Cargos } from '../../cargos/cargos';
import { CargosService } from '../../cargos/cargos.service';

@Component({
  selector: 'app-formulario-autoridades',
  templateUrl: './formulario-autoridades.component.html',
  styleUrls: ['./formulario-autoridades.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioAutoridadesCompoennt implements OnInit {
  form!: FormGroup;
  cargos$!: Observable<Cargos>;
  @Output('refresh') refresh: EventEmitter<Autoridade> = new EventEmitter();

  protected config!: any

  constructor(
    private autoridadesService: AutoridadesService,
    private cargosService: CargosService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.cargos$ = this.cargosService.index();

    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    this.config = this.sharedService.getConfig();
    this.config = {...this.config, displayFn:(item: Cargo) => { return `${item.nome}`; }, placeholder:'Cargo'};

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      cargo: [
        '',
        [Validators.required],
      ],
      cargo_id: [''],
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


  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    this.form.get('cargo_id')?.patchValue(this.form.value.cargo.id);
    this.form.get('cargo')?.patchValue('');

    //console.log(this.form.value);
    if(this.form.value.id){
      this.autoridadesService.update(this.form.value).subscribe({
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
      this.autoridadesService.store(this.form.value).subscribe({
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
  setForm(data: Autoridade){
    this.form.patchValue(data);
  }
}
