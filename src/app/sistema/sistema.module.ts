import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SistemaRoutingModule } from "./sistema-routing.module";
import { SistemaComponent } from "./sistema.component";

@NgModule({
    declarations: [SistemaComponent],
    imports: [CommonModule, SistemaRoutingModule, NavbarComponent, SidebarComponent],
    exports: []
})

export class SistemaModule{}