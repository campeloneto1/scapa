import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';
import { Orgao, Orgaos } from '../../orgaos/orgaos';
import { OrgaosService } from '../../orgaos/orgaos.service';
import { Perfil, Perfis } from '../../perfis/perfis';
import { PerfisService } from '../../perfis/perfis.service';
import { Usuario } from '../usuarios';
import { UsuariosService } from '../usuarios.service';

@Component({
  selector: 'app-formulario-usuarios',
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioUsuariosCompoennt implements OnInit {
  form!: FormGroup;
  @Output('refresh') refresh: EventEmitter<Usuario> = new EventEmitter();
  perfis$!: Observable<Perfis>;
  orgaos$!: Observable<Orgaos>;

  // protected config!: any;
  // protected config2!: any;

  constructor(
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private perfisService: PerfisService,
    private orgaosService: OrgaosService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    //RETORNA OS PERFIS
    this.perfis$ = this.perfisService.index();
    this.orgaos$ = this.orgaosService.index();

    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    // this.config = this.sharedService.getConfig();
    // this.config = {...this.config, displayFn:(item: Perfil) => { return `${item.nome}`; }, placeholder:'Perfil'};
    // this.config2 = this.sharedService.getConfig();
    // this.config2 = {...this.config, displayFn:(item: Orgao) => { return `${item.nome}`; }, placeholder:'Orgão'};

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      perfil_id: ['', [Validators.required]],
      perfil: [''],
      orgao_id: ['', [Validators.required]],
      orgao: [''],
      nome: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
        ]),
      ],
      cpf: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
      ],
      //rg: [''],
      //uf_rg: [''],
      //uf_rg_id: [''],
      email: ['', [Validators.email]],
      telefone1: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
      ],
      telefone2: [
        '',
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
        ]),
      ],
    });
  }

  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    // this.form.get('perfil_id')?.patchValue(this.form.value.perfil.id);
    // this.form.get('perfil')?.patchValue('');
    // this.form.get('orgao_id')?.patchValue(this.form.value.orgao.id);
    // this.form.get('orgao')?.patchValue('');
    //console.log(this.form.value);
    if(this.form.value.id){
      this.usuariosService.update(this.form.value).subscribe({
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
      this.usuariosService.store(this.form.value).subscribe({
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
  setForm(data: Usuario){
    this.form.patchValue(data);
  }
}
