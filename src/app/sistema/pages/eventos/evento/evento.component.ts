import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { Evento } from "../eventos";
import { EventosService } from "../eventos.service";
import { environment } from "src/environments/environments";
import { Pessoa, Pessoas } from "../../pessoas/pessoas";
import { PessoasService } from "../../pessoas/pessoas.service";
import { SharedService } from "src/app/sistema/shared/shared.service";

@Component({
    selector: 'app-evento',
    templateUrl: './evento.component.html',
    styleUrls: ['./evento.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent]
})

export class EventoComponent implements OnInit{
    id!: number;
    evento$!: Observable<Evento>;
    pessoas$!: Observable<Pessoas>;
    urlimage = environment.image;

    protected config!: any

    constructor(
        private activatedRoute: ActivatedRoute,
        private sharedService: SharedService,
        private eventosService: EventosService,
        private pessoasService: PessoasService
    ){

    }
    ngOnInit(): void {
        //RETORNA CONFIGRACAO DO NGX SELECT DROPDOWN
        this.config = this.sharedService.getConfig();
        this.config = {...this.config, displayFn:(item: Pessoa) => { return `${item.nome}`; }, placeholder:'Pessoas'};

        this.id = this.activatedRoute.snapshot.params['id'];
        this.evento$ = this.eventosService.show(this.id);

        this.pessoas$ = this.pessoasService.index();
    }
}