import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { Pessoa, Pessoas } from "../../pessoas/pessoas";
import { PessoasService } from "../../pessoas/pessoas.service";
import { Posto, Postos } from "../../postos/postos";
import { PostosService } from "../../postos/postos.service";
import { Setor, Setores } from "../../setores/setores";
import { SetoresService } from "../../setores/setores.service";

@Component({
    selector: 'app-acesso',
    templateUrl: './acesso.component.html',
    styleUrls: ['acesso.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent]
})

export class AcessoComponent implements OnInit{
    form!: FormGroup;

    postos$!: Observable<Postos>;
    setores$!: Observable<Setores>;
    pessoas$!: Observable<Pessoas>;

    protected config!: any
    protected config2!: any
    protected config3!: any

    constructor(
        private pessoasService: PessoasService,
        private setoresService: SetoresService,
        private postosService: PostosService,
        private sharedService: SharedService,
        private formBuilder: FormBuilder
    ){

    }

    ngOnInit(): void {
        
        this.form = this.formBuilder.group({
            'posto': ['', Validators.required],
            'posto_id': [''],
            'pessoa': ['', Validators.required],
            'pessoa_id': [''],
            'setor': ['', Validators.required],
            'setor_id': [''],
            'data_hora': [''],
            'obs': [''],
        });

        if(localStorage.getItem('posto')){
            //@ts-ignore
            this.form.get('posto')?.patchValue(JSON.parse(localStorage.getItem('posto')))
        }

        this.postos$ = this.postosService.index();
        this.setores$ = this.setoresService.index();
        this.pessoas$ = this.pessoasService.index();

        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        this.config = this.sharedService.getConfig();
        this.config = {...this.config, displayFn:(item: Posto) => { return `${item.nome}`; }, placeholder:'Selecione um Posto'};

        this.config2 = this.sharedService.getConfig();
        this.config2 = {...this.config, displayFn:(item: Pessoa) => { return `${item.nome} (${item.cpf})`; }, placeholder:'Selecione uma Pessoa'};

        this.config3 = this.sharedService.getConfig();
        this.config3 = {...this.config, displayFn:(item: Setor) => { return `${item.nome}`; }, placeholder:'Setor'};
    }

    setPosto(){
        console.log(this.form.value.posto)
        localStorage.setItem('posto', JSON.stringify(this.form.value.posto))
    }

    
}