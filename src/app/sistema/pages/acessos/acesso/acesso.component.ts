import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { FormularioPessoasCompoennt } from "../../pessoas/formulario/formulario-pessoas.component";
import { Pessoa, Pessoas } from "../../pessoas/pessoas";
import { PessoasService } from "../../pessoas/pessoas.service";
import { Posto, Postos } from "../../postos/postos";
import { PostosService } from "../../postos/postos.service";
import { Setor, Setores } from "../../setores/setores";
import { SetoresService } from "../../setores/setores.service";
import { AcessosService } from "../acessos.service";
import { environment } from "src/environments/environments";
import { Eventos } from "../../eventos/eventos";
@Component({
    selector: 'app-acesso',
    templateUrl: './acesso.component.html',
    styleUrls: ['acesso.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent, FormularioPessoasCompoennt]
})

export class AcessoComponent implements OnInit, OnDestroy{
    form!: FormGroup;
    urlimage = environment.image;
    postos$!: Observable<Postos>;
    setores$!: Observable<Setores>;
    pessoas$!: Observable<Pessoas>;
    pessoa!: Pessoa;
    pessoas!: Pessoas;
    pessoas2!: Pessoas;
    eventos!: Eventos;
    cadastro:boolean = false;
    protected cadpessoa = true;

    protected config!: any
    protected config2!: any
    protected config3!: any

    protected subscription!: any;

    constructor(
        private acessosService: AcessosService,
        private pessoasService: PessoasService,
        private setoresService: SetoresService,
        private postosService: PostosService,
        private sharedService: SharedService,
        private formBuilder: FormBuilder
    ){

    }

    ngOnInit(): void {
        
        this.form = this.formBuilder.group({
            'cpfpesquisa': ['', Validators.required],
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
        //this.pessoas$ = this.pessoasService.index();

        this.pessoasService.index().subscribe({
            next: (data) => {
                this.pessoas2 = data;
            }
        })

        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        this.config = this.sharedService.getConfig();
        this.config = {...this.config, displayFn:(item: Posto) => { return `${item.orgao.nome} - ${item.nome}`; }, placeholder:'Selecione um Posto'};

        /*this.config2 = this.sharedService.getConfig();
        this.config2 = {...this.config, displayFn:(item: Pessoa) => { return `${item.nome} (${item.cpf})`; }, placeholder:'Selecione uma Pessoa'};*/

        this.config3 = this.sharedService.getConfig();
        this.config3 = {...this.config, displayFn:(item: Setor) => { return `${item.nome}`; }, placeholder:'Setor'};
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
    }

    setPosto(){
        //console.log(this.form.value.posto)
        localStorage.setItem('posto', JSON.stringify(this.form.value.posto))
    }

    unsetPosto(){
        localStorage.removeItem('posto');
        this.form.get('posto')?.patchValue('');
        this.form.get('pessoa')?.patchValue('');
        this.form.get('setor')?.patchValue('');
        this.form.get('obs')?.patchValue('');
        this.form.get('cpf')?.patchValue('');
    }

    refresh($event:any){
        //console.log($event);

        //this.pessoas$ = this.pessoasService.index();
        this.cadpessoa = false;
        
        this.subscription = this.pessoasService.checkCpf2($event.cpf).subscribe({
            next: (data:any) => {
                if(data.length > 0){
                    //this.pessoa = data[0];
                    this.form.get('pessoa')?.patchValue(data[0]);
                    //console.log('cccccccccccc');
                    this.cadpessoa = false;
                }else{
                   this.cadpessoa = true;
                }
            },
            error: (erro) => {
                console.log('bbbbbb')
            }
        });
    }

    getPessoa(){
        //console.log('aaaaaaaaaaaaaa')
        //console.log('aaaaaaaaaaaaaa')
        if(this.form.value.cpf.length == 11){
            this.subscription = this.pessoasService.checkCpf2(this.form.value.cpf).subscribe({
                next: (data:any) => {
                    if(data.length > 0){
                        //this.pessoa = data[0];
                        this.form.get('pessoa')?.patchValue(data[0]);
                        //console.log('cccccccccccc');
                        this.cadpessoa = false;
                    }else{
                       this.cadpessoa = true;
                    }
                },
                error: (erro) => {
                    console.log('bbbbbb')
                }
            });
        }else{
            this.cadpessoa = true;
        }
        
        
    }

    searchCpf(){
        //console.log('aaaaaaaaaa')
        if(this.form.value.cpfpesquisa.length < 4){
            this.form.get('pessoa')?.patchValue('');
            this.cadpessoa = true;
        }
        if(this.form.value.cpfpesquisa.length >= 4 && this.form.value.cpfpesquisa.length < 11){
            this.subscription = this.pessoasService.searchCpf(this.form.value.cpfpesquisa).subscribe({
                next: (data:any) => {
                    if(data.length > 0){
                        //this.pessoa = data[0];
                        //this.form.get('pessoa')?.patchValue(data[0]);
                        //console.log('cccccccccccc');
                        this.pessoas = data;
                        if(data.length > 1){
                            this.cadpessoa = true;
                        }
                        
                    }else{
                       this.cadpessoa = true;
                    }
                },
                error: (erro) => {
                    //console.log('bbbbbb')
                }
            });
        }else if(this.form.value.cpfpesquisa.length == 11){
            this.subscription = this.pessoasService.checkCpf2(this.form.value.cpfpesquisa).subscribe({
                next: (data:any) => {
                    if(data.length == 1){
                        //this.pessoa = data[0];
                        this.form.get('pessoa')?.patchValue(data[0]);
                        //console.log('cccccccccccc');
                        this.cadpessoa = false;
                    }else{
                       this.cadpessoa = true;
                    }
                },
                error: (erro) => {
                    //console.log('bbbbbb')
                }
            });
        }else{
            this.cadpessoa = true;
        }
    }

    teste(){
        if(this.form.value.cpf == '' ){
            this.cadpessoa = true;
        }
    }

    registrar(){
        if(this.form.valid){
            this.form.get('cpfpesquisa')?.patchValue('');

            this.form.get('pessoa_id')?.patchValue(this.form.value.pessoa.id);
            this.form.get('pessoa')?.patchValue('');
    
            this.form.get('posto_id')?.patchValue(this.form.value.posto.id);
    
            this.form.get('setor_id')?.patchValue(this.form.value.setor.id);
            this.form.get('setor')?.patchValue('');
    
            this.acessosService.store(this.form.value).subscribe({
                next: (data) => {
                    this.sharedService.toast('Sucesso!', data as string, 1);
    
                    this.form.get('pessoa_id')?.patchValue('');
                    this.form.get('pessoa')?.patchValue('');
                    this.form.get('setor_id')?.patchValue('');
                    this.form.get('setor')?.patchValue('');
                    this.form.get('obs')?.patchValue('');
                    this.cadpessoa = true;
                },
                error: (error) => {
                    this.sharedService.toast('Error!', error.error.erro as string, 2);
                }
            })
        }
    }

    closeWeb(){
        this.cadastro = false;
        this.pessoasService.whereEvento(this.form.value.pessoa.id).subscribe({
            next: (data) => {
                this.eventos = data as Eventos;
                
            },
            error: (error) => {
                this.sharedService.toast('Error!', error.error.erro as string, 2);
            }
        })
    }
}