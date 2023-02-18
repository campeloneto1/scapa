import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { FormularioPessoasCompoennt } from "../../pessoas/formulario/formulario-pessoas.component";
import { Posto, Postos } from "../../postos/postos";
import { Setor, Setores } from "../../setores/setores";
import { environment } from "src/environments/environments";
import { Orgao, Orgaos } from "../../orgaos/orgaos";
import { OrgaosService } from "../../orgaos/orgaos.service";
import { RelatoriosService } from "../relatorios.service";
import { Acessos } from "../../acessos/acessos";
@Component({
    selector: 'app-rel-acessos',
    templateUrl: './rel-acessos.component.html',
    styleUrls: ['rel-acessos.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent, FormularioPessoasCompoennt]
})

export class RelAcessosComponent implements OnInit{
    form!: FormGroup;
    urlimage = environment.image;
    show: boolean = false;
    orgaos$!: Observable<Orgaos>;
    postos$!: Observable<Postos>;
    setores$!: Observable<Setores>;
    data$!: Observable<Acessos>;

    protected config!: any
    protected config2!: any
    protected config3!: any

    constructor(
        private relatoriosService: RelatoriosService,
        private orgaosService: OrgaosService,
        private sharedService: SharedService,
        private formBuilder: FormBuilder
    ){

    }

    ngOnInit(): void {
        
        this.form = this.formBuilder.group({
            'orgao': ['', Validators.required],
            'orgao_id': [''],
            'posto': [''],
            'posto_id': [''],

            'setor': [''],
            'setor_id': [''],
            'data_hora_inicio': ['', Validators.required],
            'data_hora_fim': ['', Validators.required],
        });

       
        this.orgaos$ = this.orgaosService.index();
      
        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        this.config = this.sharedService.getConfig();
        this.config = {...this.config, displayFn:(item: Orgao) => { return `${item.nome}`; }, placeholder:'Orgão'};

        this.config2 = this.sharedService.getConfig();
        this.config2 = {...this.config, displayFn:(item: Posto) => { return `${item.nome}`; }, placeholder:'Posto'};

        this.config3 = this.sharedService.getConfig();
        this.config3 = {...this.config, displayFn:(item: Setor) => { return `${item.nome}`; }, placeholder:'Setor'};
    }

    
    getSetoresPostos(){
        this.postos$ = this.orgaosService.where_postos(this.form.value.orgao.id);
        this.setores$ = this.orgaosService.where_setores(this.form.value.orgao.id);
    }

    consultar(){
        this.show = true;
        this.form.get('orgao_id')?.patchValue(this.form.value.orgao.id);
        this.form.get('orgao')?.patchValue('');

        if(this.form.value.setor){
            this.form.get('setor_id')?.patchValue(this.form.value.setor.id);
            this.form.get('setor')?.patchValue('');
        }

        if(this.form.value.posto){
            this.form.get('posto_id')?.patchValue(this.form.value.posto.id);
            this.form.get('posto')?.patchValue('');
        }
    
        this.data$ = this.relatoriosService.relAcessos(this.form.value);
           
        //console.log(this.form.value)
    }

    
}