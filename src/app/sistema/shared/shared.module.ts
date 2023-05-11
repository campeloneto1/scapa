import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormsModule   } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { WebcamModule } from 'ngx-webcam';
import { InputSelectModule } from '../components/input-select/input-select.module';
import { InputTextModule } from '../components/input-text/input-text.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { ChartjsModule } from '@ctrl/ngx-chartjs';
import {
    BarController,
    BarElement,
    Chart,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
// What you register will depend on what chart you are using and features used.
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


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
    InputSelectModule,
    FormsModule,
    WebcamModule,
    NgxPaginationModule,
    ChartjsModule
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
    FormsModule,
    WebcamModule,
    NgxPaginationModule,
    ChartjsModule
  ],
})
export class SharedModule {}
