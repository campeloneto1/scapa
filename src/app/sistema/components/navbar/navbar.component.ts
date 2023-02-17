import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { SessionService } from "../../shared/session.service";
import { SharedModule } from "../../shared/shared.module";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [CommonModule, SharedModule]
})

export class NavbarComponent{

    constructor(private sessionService: SessionService){

    }

    logout(){
        this.sessionService.logout();
    }

}