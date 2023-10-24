import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { SharedService } from "src/app/sistema/shared/shared.service";
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-formulario-importacao',
    templateUrl: './formulario-importacao.component.html',
    styleUrls: ['./formulario-importacao.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class FormularioImportacaoComponent implements OnInit{
    form!: FormGroup;
    @Output('refresh') refresh: EventEmitter<any> = new EventEmitter();
    datasheet: any;

    constructor(
       
        private formBuilder: FormBuilder,
        private sharedService: SharedService,
      ) {}

    ngOnInit(): void {
        //BUILD O FORMULARIO COM VALIDACOES
        this.form = this.formBuilder.group({
            id: [''],
            file: [
            '',
            Validators.compose([
                Validators.required,
               
            ]),
            ],
         
        });
    }
    
    
    public uploadData(event: any) : void { 
       /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) {
        throw new Error('Cannot use multiple files');
        }
        const reader: FileReader = new FileReader();
        reader.readAsBinaryString(target.files[0]);
        reader.onload = (e: any) => {
        /* create workbook */
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        /* selected the first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        //console.log(data); // Data will be logged in array format containing objects
        this.datasheet = data;
    };
    }

    cadastrar(){
        this.refresh.emit(this.datasheet);
    }
    
}