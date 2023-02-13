import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SistemaRoutingModule } from "./sistema-routing.module";
import { SistemaComponent } from "./sistema.component";

@NgModule({
    declarations: [SistemaComponent],
    imports: [CommonModule, SistemaRoutingModule],
    exports: []
})

export class SistemaModule{}