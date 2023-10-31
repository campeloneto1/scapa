import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-formulario-pessoas',
  templateUrl: './formulario-pessoas.component.html',
  styleUrls: ['./formulario-pessoas.component.css'],
  standalone: true,
  imports: [CommonModule, SharedModule],
})
export class FormularioPessoasCompoennt implements OnInit, OnDestroy, AfterViewInit {
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
  private facematcher!: any; 

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

  constructor(
    private http: HttpClient,
    private pessoasService: PessoasService,
    private formBuilder: FormBuilder,
    private orgaosService: OrgaosService,
    private sexosService: SexosService,
    private sharedService: SharedService,
    private SessionService: SessionService,
    private faceapiService: FaceapiService
  ) {
    
  }

  ngAfterViewInit(): void {
    this.faceapiService.loadModels();
  }
 

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

    //BUILD O FORMULARIO COM VALIDACOES
    this.form = this.formBuilder.group({
      id: [''],
      face_matcher: [''],
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
    if(this.facematcher){
      this.facematcher._labeledDescriptors[0]._label = `${this.form.value.nome} (${this.form.value.cpf})`;
      this.form.get('face_matcher')?.patchValue(JSON.stringify(this.facematcher));
    }
    
    if(this.form.value.id){
      this.pessoasService.update(this.form.value).subscribe({
        next: (data:any) => {
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
    //var previous = this.faceapiService.fromJson(JSON.parse('{"distanceThreshold":0.6,"labeledDescriptors":[{"label":"Jose de Barros Campelo Neto","descriptors":[[-0.14661304652690887,0.05831713601946831,0.07529032975435257,-0.07388003915548325,-0.0846615731716156,0.04151558130979538,-0.05660773813724518,-0.014945860020816326,0.13153581321239471,-0.059364769607782364,0.24978002905845642,-0.003938376437872648,-0.26981884241104126,-0.027484485879540443,-0.019695203751325607,0.09978137910366058,-0.10277889668941498,-0.07130851596593857,-0.08086314797401428,-0.10454567521810532,0.09876058250665665,0.0007373732514679432,0.03751268610358238,0.016962489113211632,-0.13128182291984558,-0.36336201429367065,-0.09595101326704025,-0.19892023503780365,-0.02847476489841938,-0.15079542994499207,0.007622898556292057,-0.08228820562362671,-0.11946283280849457,-0.011231459677219391,-0.0541035495698452,0.036519456654787064,-0.07034259289503098,-0.060670025646686554,0.09353581070899963,-0.027668286114931107,-0.1335187554359436,0.05101780593395233,0.013999296352267265,0.17822417616844177,0.1186196431517601,0.059891026467084885,0.045805640518665314,-0.06781879812479019,0.11014464497566223,-0.2675724923610687,0.06762269139289856,0.11579011380672455,0.09676038473844528,0.04842019081115723,0.18120969831943512,-0.07655058801174164,0.05486489459872246,0.1440645009279251,-0.20074526965618134,0.14276263117790222,0.03606821969151497,0.02115747332572937,-0.043956734240055084,-0.05473092570900917,0.15857166051864624,0.13536126911640167,-0.14471383392810822,-0.12356150150299072,0.0855741947889328,-0.11392698436975479,-0.04208223521709442,0.13379189372062683,-0.1187722235918045,-0.25457966327667236,-0.2045092135667801,0.11475779861211777,0.397901326417923,0.1644216626882553,-0.1686011701822281,-0.03241883963346481,-0.0948837473988533,-0.020130569115281105,0.02668183483183384,-0.004509847145527601,-0.0852479338645935,-0.04665904864668846,-0.15336421132087708,0.023175053298473358,0.1255161315202713,-0.024070823565125465,0.018079707399010658,0.26917600631713867,-0.019832177087664604,0.07164877653121948,-0.01284857839345932,0.13458506762981415,-0.19831378757953644,-0.010548126883804798,-0.062442127615213394,-0.057948801666498184,0.07853369414806366,-0.08704029023647308,-0.039817407727241516,0.030485784634947777,-0.13248389959335327,0.128366157412529,-0.09252270311117172,-0.009112782776355743,-0.0392431803047657,0.010025152005255222,-0.08549503237009048,0.019936395809054375,0.14318808913230896,-0.2370690107345581,0.13919934630393982,0.19962304830551147,0.04962998628616333,0.08860550820827484,0.08313976973295212,-0.013746815733611584,-0.028311965987086296,-0.05686270073056221,-0.21488818526268005,-0.046461500227451324,0.013616057112812996,-0.043916504830121994,-0.06529401987791061,-0.009128816425800323]]}]}'));
    
     setTimeout(async () => { 
      //detectedFace = await this.faceapiService.recognizeFaces(this.imagetaked.nativeElement);  
       detectedFace = await this.faceapiService.recognizeFace(this.imagetaked.nativeElement);  
      if(detectedFace){
        //@ts-ignore
        this.facematcher = await this.faceapiService.facematcher(detectedFace);      
      }
    }, 500 );
    
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
