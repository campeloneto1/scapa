import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { SharedService } from "src/app/sistema/shared/shared.service";
import { FormularioPessoasCompoennt } from "../../pessoas/formulario/formulario-pessoas.component";
import { Pessoa, Pessoas } from "../../pessoas/pessoas";
import { PessoasService } from "../../pessoas/pessoas.service";
import { Postos } from "../../postos/postos";
import { PostosService } from "../../postos/postos.service";
import { Setores } from "../../setores/setores";
import { SetoresService } from "../../setores/setores.service";
import { AcessosService } from "../acessos.service";
import { environment } from "src/environments/environments";
import { Eventos } from "../../eventos/eventos";
import { Funcionario, Funcionarios } from "../../funcionarios/funcionarios";
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FaceapiService } from "../../pessoas/faceapi.service";
@Component({
    selector: 'app-acesso',
    templateUrl: './acesso.component.html',
    styleUrls: ['acesso.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent, FormularioPessoasCompoennt]
})

export class AcessoComponent implements OnInit, OnDestroy, AfterViewInit{
    protected form!: FormGroup;
    protected form2!: FormGroup;
    protected urlimage = environment.image;
    protected postos$!: Observable<Postos>;
    protected setores$!: Observable<Setores>;
    protected pessoas$!: Observable<Pessoas>;
    protected funcionarios$!: Observable<Funcionarios>;
    protected pessoa!: Pessoa;
    protected pessoas!: Pessoas;
    protected  pessoas2!: Pessoas;
    protected eventos!: Eventos;
    protected cadastro:boolean = false;
    protected cadpessoa = false;

    protected subscription!: any;
    protected subscription2!: any;
    protected subscription3!: any;
    protected subscription4!: any;
    protected subscription5!: any;
    protected subscription6!: any;

    private readonly searchSubject = new Subject<string | undefined>();

    public precisaTrocarFoto = false;

    public sysImage!: string;
    public webcamImage!: WebcamImage;
    // toggle webcam on/off
    public showWebcam = true;
    public allowCameraSwitch = true;
    public multipleWebcamsAvailable = false;
    public deviceId!: string;
    public videoOptions: MediaTrackConstraints = {
        // width: {ideal: 1024},
        // height: {ideal: 576}
    };
    public errors: WebcamInitError[] = [];

    @ViewChild('imagetaked', { static: false }) imagetaked!: ElementRef;
    @ViewChild('imagematch', { static: false }) imagematch!: ElementRef;
    private facematchersring!: any; 

    // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

    constructor(
        private http: HttpClient,
        private faceapiService: FaceapiService,
        private acessosService: AcessosService,
        private pessoasService: PessoasService,
        private setoresService: SetoresService,
        private postosService: PostosService,
        private sharedService: SharedService,
        private formBuilder: FormBuilder,
        
    ){
    }

    ngOnInit(): void {
        
        this.form = this.formBuilder.group({
            'cpfpesquisa': ['', Validators.required],
            'posto': [''],
            'posto_id': ['', Validators.required],
            'pessoa': ['', Validators.required],
            'pessoa_id': [''],
            'setor': [''],
            'setor_id': ['', Validators.required],
            'funcionario': [''],
            'funcionario_id': [''],
            'data_hora': [''],
            'obs': [''],
        });

        if(localStorage.getItem('posto')){
            //@ts-ignore
            this.form.get('posto')?.patchValue(JSON.parse(localStorage.getItem('posto')));
            this.form.get('posto_id')?.patchValue(this.form.value.posto?.id)
        }

        this.postos$ = this.postosService.index();
        this.setores$ = this.setoresService.index();    
        
        this.subscription2 = this.searchSubject.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap((data:any) => this.pessoasService.searchCpf(data))
          ).subscribe({
            next: (data:any) => {
                if(data.length > 0){                   
                    
                    if(data.length > 1){
                        this.pessoas = data;
                        this.cadpessoa = true;
                    }else{
                        this.cadpessoa = false;
                        this.form.get('pessoa')?.patchValue(data[0]);
                        this.updateFaceMatcher();
                    }                    
                }else{
                   this.cadpessoa = true;
                }
             
            },
            error: (erro) => {
            }
        });

        
    }

    ngAfterViewInit(): void {
        this.faceapiService.loadModels();
    }

    ngOnDestroy(): void {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
        if(this.subscription2){
            this.subscription2.unsubscribe();
        }
        if(this.subscription3){
            this.subscription3.unsubscribe();
        }
        if(this.subscription4){
            this.subscription4.unsubscribe();
        }
        if(this.subscription5){
            this.subscription5.unsubscribe();
        }
    }

    setPosto(){
        this.postos$.subscribe({
            next: (data) => {
                data.forEach((posto) => {
                    if(posto.id == this.form.value.posto_id){
                        localStorage.setItem('posto', JSON.stringify(posto));
                        this.form.get('posto')?.patchValue(posto);
                    }
                });
            }
        }); 
    }

    getFuncionarios(){
        this.funcionarios$ = of([]);
        this.funcionarios$ = this.setoresService.where(this.form.value.setor_id);
    }

    unsetPosto(){
        localStorage.removeItem('posto');
        this.form.get('posto')?.patchValue('');
        this.form.get('posto_id')?.patchValue('');
        this.clearSearch();
    }

    refresh($event:any){
        this.cadpessoa = false;
        
        this.subscription = this.pessoasService.checkCpf2($event.cpf).subscribe({
            next: (data:any) => {
                if(data.length > 0){
                    //this.pessoa = data[0];
                    this.form.get('pessoa')?.patchValue(data[0]);
                    this.cadpessoa = false;
                }else{
                   this.cadpessoa = true;
                }
            },
            error: (erro) => {
            }
        });
    }

    getPessoa(){
        if(this.form.value.cpf.length == 11){
            this.subscription3 = this.pessoasService.checkCpf2(this.form.value.cpf).subscribe({
                next: (data:any) => {
                    if(data.length > 0){
                        this.form.get('pessoa')?.patchValue(data[0]);
                        this.cadpessoa = false;
                    }else{
                       this.cadpessoa = true;
                    }
                },
                error: (erro) => {
                }
            });
        }else{
            this.cadpessoa = true;
        }
    }

    checkCpf2(){
        this.subscription4 = this.pessoasService.checkCpf2(this.form.value.cpfpesquisa).subscribe({
            next: (data:any) => {
                if(data.length == 1){
                    this.form.get('pessoa')?.patchValue(data[0]);
                    this.cadpessoa = false;
                    this.updateFaceMatcher();
                   
                }else{
                    this.pessoas = data;
                   this.cadpessoa = true;
                }
                
            },
            error: (erro) => {
            }
        });
    }

    public updateFaceMatcher(){
        //console.log("entrou")
        if(!this.form.value.pessoa.face_matcher && this.form.value.pessoa.foto){
            var detectedFace;  
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = this.urlimage+this.form.value.pessoa.foto;  
            setTimeout(async () => { 
                //detectedFace = await this.faceapiService.recognizeFaces(img);  
                 detectedFace = await this.faceapiService.recognizeFace(img);  
                if(detectedFace){
                   //@ts-ignore
                   this.facematchersring = await this.faceapiService.facematcher(detectedFace);     
                   this.facematchersring._labeledDescriptors[0]._label = `${this.form.value.pessoa.nome} (${this.form.value.pessoa.cpf})`; 
                    //console.log(this.facematchersring);
                    var obj = {
                        id: this.form.value.pessoa.id,
                        face_matcher: JSON.stringify(this.facematchersring)
                    }
                    this.pessoasService.updateFacematcher(obj).subscribe({
                        next: (data:any) => {
                                                      
                        },
                        error: (erro) => {
                        }
                    });
                    this.precisaTrocarFoto = false;
                }else{
                    //console.log('recomendo trocar foto')
                    this.precisaTrocarFoto = true;
                }
            }, 500 );
        }
    }

    searchCpf(){
        if(this.form.value.cpfpesquisa.length < 5){
            this.form.get('pessoa')?.patchValue('');
            this.cadpessoa = false;
        }else if(this.form.value.cpfpesquisa.length >= 5 && this.form.value.cpfpesquisa.length < 11){
            this.searchSubject.next(this.form.value.cpfpesquisa.trim());
        }else if(this.form.value.cpfpesquisa.length == 11){
            this.checkCpf2();
        }else{
            this.searchSubject.next(this.form.value.cpfpesquisa.trim());
        }
    }

    clearSearch(){
        this.form.get('cpfpesquisa')?.patchValue('');
        this.form.get('pessoa')?.patchValue('');
        this.form.get('pessoa_id')?.patchValue('');
        this.form.get('setor')?.patchValue('');
        this.form.get('setor_id')?.patchValue('');
        this.form.get('funcionario')?.patchValue('');
        this.form.get('funcionario_id')?.patchValue('');
        this.form.get('obs')?.patchValue('');
        this.funcionarios$ = of([]);
        this.cadpessoa = false;   
        this.precisaTrocarFoto = false;
    }

     registrar(){                
        if(this.form.valid){
            this.form.get('cpfpesquisa')?.patchValue('');

            this.form.get('pessoa_id')?.patchValue(this.form.value.pessoa.id);
            this.form.get('pessoa')?.patchValue('');
               
            this.subscription5 = this.acessosService.store(this.form.value).subscribe({
                next: (data) => {
                    this.sharedService.toast('Sucesso!', data as string, 1);
                    this.clearSearch();
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

    public getSnapshot(): void {
        this.trigger.next(void 0);
      }
    
      public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.sysImage = webcamImage.imageAsDataUrl;
       
        var detectedFace;    
        
        setTimeout(async () => { 
            //detectedFace = await this.faceapiService.recognizeFaces(this.imagetaked.nativeElement);  
             detectedFace = await this.faceapiService.recognizeFace(this.imagetaked.nativeElement);  
            if(detectedFace){
              //@ts-ignore
              this.facematchersring = await this.faceapiService.facematcher(detectedFace);      
              this.uploadImagem(this.webcamImage);
            }
          }, 500 );
      }

      uploadImagem(webcamImage: WebcamImage){
        var myFormData = new FormData();
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        myFormData.append('image', webcamImage.imageAsDataUrl);
        
        this.http.post(`${environment.url}/upload-foto`, myFormData, {
        headers: headers
        }).subscribe({
          next: (data) => {
           if(this.facematchersring){
                this.facematchersring._labeledDescriptors[0]._label = `${this.form.value.pessoa.nome} (${this.form.value.pessoa.cpf})`;                 
            }

           var updatefoto = {
            id: this.form.value.pessoa.id,
            foto: data,
            face_matcher: JSON.stringify(this.facematchersring)
           }

           this.http.post(`${environment.url}/update-foto`, updatefoto, {
            headers: headers
            }).subscribe({
              next: (data) => {       
                this.precisaTrocarFoto = false;       
               this.pessoasService.show(this.form.value.pessoa.id).subscribe({
                next: (data) => {
                    this.form.get('pessoa')?.patchValue(data);
                }
               })                   
              },
              error: (error) => {
               
              }
            }); 

          },
          error: (error) => {
           
          }
        }); 
      }
    
      public triggerSnapshot(): void {
        this.trigger.next();
      }
    
      public toggleWebcam(): void {
        this.showWebcam = !this.showWebcam;
      }
    
      public handleInitError(error: WebcamInitError): void {
        this.errors.push(error);
      }
    
      public showNextWebcam(directionOrDeviceId: boolean | string): void {
        // true => move forward through devices
        // false => move backwards through devices
        // string => move to device with given deviceId
        this.nextWebcam.next(directionOrDeviceId);
      }
    
      public cameraWasSwitched(deviceId: string): void {
        //console.log('active device: ' + deviceId);
        this.deviceId = deviceId;
      }
    
      public get triggerObservable(): Observable<void> {
        return this.trigger.asObservable();
      }
    
      public get nextWebcamObservable(): Observable<boolean | string> {
        return this.nextWebcam.asObservable();
      }
}