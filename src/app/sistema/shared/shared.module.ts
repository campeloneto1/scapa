import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { InputSelectModule } from '../components/input-select/input-select.module';
import { InputTextModule } from '../components/input-text/input-text.module';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DataTablesModule,
    SelectDropDownModule,
    ReactiveFormsModule,
    InputTextModule, 
    InputSelectModule
  ],
  providers: [provideNgxMask()],
  exports: [
    NgxMaskDirective,
    NgxMaskPipe,
    DataTablesModule,
    SelectDropDownModule,
    ReactiveFormsModule,
    InputTextModule, 
    InputSelectModule,
    RouterModule,

  ],
})
export class SharedModule {}
