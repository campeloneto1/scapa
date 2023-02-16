import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Perfil } from "../../pages/perfis/perfis";
import { SessionService } from "../../shared/session.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})

export class SidebarComponent implements OnInit{

    perfil!: Perfil;

    constructor(private sessionService: SessionService){

    }

    ngOnInit(): void {
        this.perfil = this.sessionService.retornaPerfil();
    }


    
}