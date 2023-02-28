import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { TituloComponent } from "src/app/sistema/components/titulo/titulo.component";
import { SharedModule } from "src/app/sistema/shared/shared.module";
import { Evento } from "../eventos";
import { EventosService } from "../eventos.service";
import { environment } from "src/environments/environments";
import { FormularioPessoasCompoennt } from "../../pessoas/formulario/formulario-pessoas.component";
import { SessionService } from "src/app/sistema/shared/session.service";
import { Usuario } from "../../usuarios/usuarios";


@Component({
    selector: 'app-print-evento',
    templateUrl: './print.component.html',
    styleUrls: ['./print.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule, TituloComponent, FormularioPessoasCompoennt]
})

export class PrintEventoComponent implements OnInit{
    id!: number;
    evento$!: Observable<Evento>;
    urlimage = environment.image;   
    user!: Usuario;
    date = new Date();
  

    constructor(
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private eventosService: EventosService,    
    ){

    }
    ngOnInit(): void {
       
        this.user = this.sessionService.retornaUser();
        this.id = this.activatedRoute.snapshot.params['id'];
        this.evento$ = this.eventosService.show(this.id);

       
    }

    
}