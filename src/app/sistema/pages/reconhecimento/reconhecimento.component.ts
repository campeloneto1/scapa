import { CommonModule } from "@angular/common";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { TituloComponent } from "../../components/titulo/titulo.component";
import { SharedModule } from "../../shared/shared.module";
import { Pessoa, Pessoas } from "../pessoas/pessoas";
import { PessoasService } from "../pessoas/pessoas.service";
import { FaceapiService } from "../pessoas/faceapi.service";

@Component({
    selector: "app-reconhecimento",
    templateUrl: './reconhecimento.component.html',
    styleUrls: ['./reconhecimento.component.css'],
    standalone: true,
    imports: [CommonModule, TituloComponent, SharedModule]
})

export class ReconhecimentoComponent implements OnInit, OnDestroy{

    data$!: any;
    pessoas$!: Pessoas;
    file!: any;
    score: number = 0.5;
    imageSrc!: any;
    canvas!: any;
    resizedDetections!: any;

    subscription1: any;
    obj = {
        "distanceThreshold":0.6,
        "labeledDescriptors":[]
    }
    facematchers: any;
    detectedFace: any;
    result:any = [];

    @ViewChild('imageRec', { static: false }) imageRec!: ElementRef;
    @ViewChild('canvas', { static: false }) canvas2!: ElementRef;

    constructor(private pessoasService: PessoasService,
        private faceapiService: FaceapiService){
            this.faceapiService.loadModels();
    }
    

    ngOnInit() {
        this.subscription1 = this.pessoasService.returnFaceMatcher().subscribe({
            next: (data:any) => {
                data.map((pessoa:Pessoa) => {                    
                    //@ts-ignore
                    this.obj.labeledDescriptors.push(JSON.parse(pessoa.face_matcher).labeledDescriptors[0])
                });
            },
            complete: () => {
                this.faceapiService.fromJson(this.obj).then(data => {
                    this.facematchers = data;
                });
            }
        });
       
    }

    

    ngOnDestroy() {
        // if(this.subscription1){
        //     this.subscription1.unsubscrib();
        // }
    }

    uploadData(event: any){        
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];    
            const reader = new FileReader();
            reader.onload = e => this.imageSrc = reader.result;    
            reader.readAsDataURL(file);
 
            setTimeout(() => { 
                
                this.detectFaces();
            }, 500 );         
        }
    }

    async detectFaces(){
        this.result = [];

        this.detectedFace = await this.faceapiService.recognizeFaces(this.imageRec.nativeElement, this.score); 

        this.canvas = this.canvas2.nativeElement;
        this.canvas.width = this.imageRec.nativeElement.width;
        this.canvas.height = this.imageRec.nativeElement.height;
        
        await this.faceapiService.resizeResults(this.detectedFace, { width: this.imageRec.nativeElement.width, height: this.imageRec.nativeElement.height }).then(data => {
            
            this.resizedDetections = data;
        });
        const context = this.canvas.getContext('2d');
        
        await this.faceapiService.draw(this.canvas, this.resizedDetections);

        this.findMatch();
       //console.log(this.result)
    }

    async findMatch(){
        await this.detectedFace.map((face:any) => {            
            //@ts-ignore
            this.result.push(this.facematchers.findBestMatch(face.descriptor));
        });
    }
    
}