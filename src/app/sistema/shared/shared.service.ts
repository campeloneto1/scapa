import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';
import { Cidades } from '../pages/cidades/cidades';
import { CidadesService } from '../pages/cidades/cidades.service';
import { Estados } from '../pages/estados/estados';
import { EstadosService } from '../pages/estados/estados.service';
import { Paises } from '../pages/paises/paises';
import { PaisesService } from '../pages/paises/paises.service';
import type { ChartData, ChartOptions } from 'chart.js';

const API = environment.url;

@Injectable({
  providedIn: 'root',
})
export class SharedService {//
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    responsive: true,
    paging: true
  };

  config = {  
    displayKey:"id", //if objects array passed which key to be displayed defaults to description
    search:true, //true/false for the search functionlity defaults to false,
    height: '400px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear 
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 0 ,// number thats limits the no of options displayed in the UI (if zero, options will not be limited)
    moreText: 'mais', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'Informação não encontrada', // text to be displayed when no items are found while searching
    searchPlaceholder:'Pesquisar', // label thats displayed in search input,
    searchOnKey: undefined, // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false ,// clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
    selectAllLabel: 'Selecionar todos', // label that is displayed in multiple selection for select all
    enableSelectAll: false, // enable select all option to select all available items, default is false gba(61, 153, 112)
  }

  chartdata: ChartData = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        fill: false,
        backgroundColor: [
          'rgba(253, 126, 20)',
        ],
        borderColor: [
          'rgb(253, 126, 20)',
        ],
        borderWidth: 1,
      },
    ],
  };

  chartoptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Doughnut Chart',
      },
    },
  };

  

  constructor(private toastr: ToastrService,
    private paisesService: PaisesService,
    private estadosService: EstadosService,
    private cidadesService: CidadesService,
    ) {}

  toast(titulo: string, mensagem: string, tipo: number) {
    if(tipo == 1){
      this.toastr.success(mensagem, titulo);
    }
    if(tipo == 2){
      this.toastr.error(mensagem, titulo);
    }
    if(tipo == 3){
      this.toastr.info(mensagem, titulo);
    }
    if(tipo == 4){
      this.toastr.warning(mensagem, titulo);
    }
  }

  getPaises(): Observable<Paises>{
    return this.paisesService.index();
  }

  getEstados(id: number): Observable<Estados>{
    return this.estadosService.where(id);
  }

  getCidades(id: number): Observable<Cidades>{
    return this.cidadesService.where(id);
  }

  getDtOptions(): DataTables.Settings{
    return this.dtOptions;
  }

  getChartData(){
    return {
      labels: [],
      datasets: [
        {
          label: '',
          data: [],
          fill: false,
          backgroundColor: [
            'gba(61, 153, 112)',
          ],
          borderColor: [
            'gba(61, 153, 112)',
          ],
          borderWidth: 1,
        },
      ],
    } as ChartData;
  }

  getChartOptions(){
    return this.chartoptions;
  }

  getConfig(){
    return this.config;
  }

}
