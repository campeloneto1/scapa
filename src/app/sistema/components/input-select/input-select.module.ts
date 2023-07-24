import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { SelectDropDownModule } from "ngx-select-dropdown";
import { InputSelectComponent } from "./input-select.component";
import { NgxSelectModule } from 'ngx-select-ex';
@NgModule({
    declarations: [InputSelectComponent],
    imports:[CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectDropDownModule,
        NgxSelectModule
    ],
    exports: [InputSelectComponent]
})

export class InputSelectModule{}