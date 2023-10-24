import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, delay } from 'rxjs';
import { SessionService } from 'src/app/sistema/shared/session.service';
import { SharedModule } from 'src/app/sistema/shared/shared.module';
import { SharedService } from 'src/app/sistema/shared/shared.service';
import { Cidade, Cidades } from '../../cidades/cidades';
import { Estado, Estados } from '../../estados/estados';
import { OrgaosService } from '../../orgaos/orgaos.service';
import { Niveis, Nivel } from '../../niveis/niveis';
import { Pais, Paises } from '../../paises/paises';
import { Perfil } from '../../perfis/perfis';
import { Sexo, Sexos } from '../../sexos/sexos';
import { SexosService } from '../../sexos/sexos.service';
import { Pessoa } from '../pessoas';
import { PessoasService } from '../pessoas.service';
import { Orgao, Orgaos } from '../../orgaos/orgaos';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { FaceapiService } from '../faceapi.service';
import { FaceMatcher, LabeledFaceDescriptors } from 'face-api.js';

@Component({
  selector: 'app-formulario-pessoas',
  templateUrl: './formulario-pessoas.component.html',
  styleUrls: ['./formulario-pessoas.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioPessoasCompoennt implements OnInit, OnDestroy {
  urlimage = environment.image;
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
  protected cpfnotvalid:boolean = false;

  @ViewChild('imagetaked', { static: false }) imagetaked!: ElementRef;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  form!: FormGroup;

  @Output('refresh') refresh: EventEmitter<Pessoa> = new EventEmitter();
  @Output('refresh2') refresh2: EventEmitter<any> = new EventEmitter();
  protected orgaos$!: Observable<Orgaos>;
  protected niveis$!: Observable<Niveis>;
  protected sexos$!: Observable<Sexos>;
  protected paises$!: Observable<Paises>;
  protected estados$!: Observable<Estados>;
  protected estados2$!: Observable<Estados>;
  protected cidades$!: Observable<Cidades>;
  protected perfil!: Perfil;
  protected cpfexist: boolean = false;
  protected pessoacpf!: Pessoa;

  // protected config!: any
  // protected config2!: any
  // protected config3!: any
  // protected config4!: any
  // protected config5!: any
  // protected config6!: any
  // protected config7!: any

  constructor(
    private http: HttpClient,
    private pessoasService: PessoasService,
    private formBuilder: FormBuilder,
    private orgaosService: OrgaosService,
    private sexosService: SexosService,
    private sharedService: SharedService,
    private SessionService: SessionService,
    private faceapiService: FaceapiService
  ) {}
 

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    //RETORNA OS PERFIS
    this.orgaos$ = this.orgaosService.index();
    this.sexos$ = this.sexosService.index();
    this.estados2$ = this.sharedService.getEstados(1);
    this.paises$ = this.sharedService.getPaises();
    this.perfil = this.SessionService.retornaPerfil();

    //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
    // this.config = this.sharedService.getConfig();
    // this.config = {...this.config, displayFn:(item: Estado) => { return `${item.nome}`; }, placeholder:'UF RG'};

    // this.config2 = this.sharedService.getConfig();
    // this.config2 = {...this.config, displayFn:(item: Sexo) => { return `${item.nome}`; }, placeholder:'Sexo'};

    // this.config3 = this.sharedService.getConfig();
    // this.config3 = {...this.config, displayFn:(item: Nivel) => { return `${item.nome}`; }, placeholder:'Nível'};

    // this.config4 = this.sharedService.getConfig();
    // this.config4 = {...this.config, displayFn:(item: Pais) => { return `${item.nome}`; }, placeholder:'País'};

    // this.config5 = this.sharedService.getConfig();
    // this.config5 = {...this.config, displayFn:(item: Estado) => { return `${item.nome}`; }, placeholder:'Estado'};

    // this.config6 = this.sharedService.getConfig();
    // this.config6 = {...this.config, displayFn:(item: Cidade) => { return `${item.nome}`; }, placeholder:'Cidade'};

    // this.config7 = this.sharedService.getConfig();
    // this.config7 = {...this.config, displayFn:(item: Orgao) => { return `${item.nome}`; }, placeholder:'Orgão'};

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      //orgao_id: [''],
     //orgao: ['', [Validators.required,]],
      //nivel_id: [''],
      //nivel: ['', [Validators.required,]],
      sexo_id: [''],
      sexo: [''],
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
      rg: [''],
      uf_rg: [''],
      uf_rg_id: [''],
      data_nascimento: [''],
      email: ['', [Validators.email]],
      mae: [''],
      pai: [''],
      telefone1: [
        '',
        Validators.compose([
          
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
      rua: [''],
      numero: [''],
      bairro: [''],
      pais_id: [''],
      pais: [''],
      estado_id: [''],
      estado: [''],
      cidade_id: [''],
      cidade: [''],
      complemento: [''],
      cep: [''],
      foto: [''],
      obs: [''],
    });
  }

  ngOnDestroy(): void {
    this.showWebcam = false
  }

  checkCpf(){
    this.pessoasService.checkCpf(this.form.value.cpf).subscribe({
      next: (data) => {
        if(Object.keys(data).length >= 1){
          //console.log(data);
          this.cpfexist = true;
          //@ts-ignore
          this.pessoacpf = data[0];
        }else{
          this.cpfexist = false;
          if(this.testaCPF(this.form.value.cpf)) { this.cpfnotvalid = false }else{this.cpfnotvalid = true} ;
        }
        
      },
      error: (error) => {

      }
    });
  }

  testaCPF(strCPF:any) {
      var Soma;
      var Resto;
      Soma = 0;

      if (strCPF == "00000000000" || strCPF == "11111111111" || strCPF == "22222222222" 
      || strCPF == "33333333333" || strCPF == "44444444444"
      || strCPF == "55555555555" || strCPF == "66666666666" || strCPF == "77777777777" 
      || strCPF == "88888888888" || strCPF == "99999999999") return false;

      for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;

      Soma = 0;
      for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
      return true;
  }

  getNiveis(){
    if(this.form.value.orgao_id){
      this.niveis$ = this.orgaosService.where_niveis(this.form.value.orgao_id);
    }
  }

  getEstados(){
    if(this.form.value.pais_id){
     this.estados$ = this.sharedService.getEstados(this.form.value.pais_id);
    }
  }

  getCidades(){
    if(this.form.value.estado_id){
      this.cidades$ = this.sharedService.getCidades(this.form.value.estado_id);
    }
   
  }

  //FUNÇÃO CADATRO E EDÇÃO
  cadastrar(){  
    
    if(this.form.value.id){
      this.pessoasService.update(this.form.value).subscribe({
        next: (data:any) => {
          //console.log('aaaaaaaaaa')
          this.sharedService.toast('Sucesso!', data.mensagem as string, 3);
          this.form.reset();
          this.sysImage = '';
          this.refresh.emit();
          this.refresh2.emit({id: data.id, cpf: data.cpf});
        },
        error: (error) => {
          this.sharedService.toast('Error!', error.error.erro as string, 2);
        }
      });
    }else{
      this.pessoasService.store(this.form.value).subscribe({
        next: (data:any) => {
          //console.log('aaaaaaaaaa')
          this.sharedService.toast('Sucesso!', data.mensagem as string, 1);
          this.form.reset();
          this.sysImage = '';
          this.refresh.emit();
          this.refresh2.emit({id: data.id, cpf: data.cpf});
        },
        error: (error) => {
          this.sharedService.toast('Error!', error.error.erro as string, 2);
        }
      });
    }
    
  }

  //FUNÇÃO SETA INFORMACAO NO FORMULARIO
  setForm(data: Pessoa){
    //this.showwebcam = false;
    this.form.patchValue(data);

    if(data.cidade){
        this.form.get('estado_id')?.patchValue(data.cidade.estado_id);
        this.form.get('pais_id')?.patchValue(data.cidade.estado.pais_id);
        this.getEstados();
        this.getCidades();                
    }

    if(data.sexo){
        this.form.get('sexo_id')?.patchValue(data.sexo_id);        
    }

    if(data.uf_rg_id){
        this.form.get('uf_rg_id')?.patchValue(data.uf_rg_id);        
    }
    /*
    if(data.nivel){
        this.form.get('nivel')?.patchValue(data.nivel);   
        
        this.getNiveis();    
    }*/
    
  }

  public getSnapshot(): void {
    this.trigger.next(void 0);
  }

  public async handleImage(webcamImage: WebcamImage){
    this.webcamImage = webcamImage;
    this.sysImage = webcamImage.imageAsDataUrl;
    var detectedFace;

     setTimeout(async () => { 
      detectedFace = await this.faceapiService.recognizeFace(this.imagetaked.nativeElement);
      //@ts-ignore
      console.log(detectedFace?.descriptor);
      if(detectedFace){
        //@ts-ignore
        console.log(await this.faceapiService.facematcher(detectedFace));
      }
    }, 1000 );

    /*
    var myFormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    myFormData.append('image', webcamImage.imageAsDataUrl);
    
    this.http.post(`${environment.url}/upload-foto`, myFormData, {
    headers: headers
    }).subscribe({
      next: (data) => {
       this.form.get('foto')?.patchValue(data);
       
      },
      error: (error) => {
       
      }
    }); */
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
