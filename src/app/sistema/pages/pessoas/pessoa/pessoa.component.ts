import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { Pessoa } from "../pessoas";
import { PessoasService } from "../pessoas.service";
import { environment } from "src/environments/environments";

@Component({
    selector: 'app-pessoa',
    templateUrl: './pessoa.component.html',
    styleUrls: ['./pessoa.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent]
})

export class PessoaComponent implements OnInit{
    id!: number;
    pessoa$!: Observable<Pessoa>;
    urlimage = environment.image;

    constructor(
        private activatedRoute: ActivatedRoute,
        private pessoasService: PessoasService
    ){

    }
    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.params['id'];
        this.pessoa$ = this.pessoasService.show(this.id);
    }
}