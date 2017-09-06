import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donnut',
  templateUrl: './donnut.component.html',
  styleUrls: ['./donnut.component.css']
})
export class DonnutComponent implements OnInit {
  public doughnutChartLabels:string[] = ['Pendientes', 'Pagados'];
  public doughnutChartData:number[] = [100, 450];
  public doughnutChartType:string = 'doughnut';

  constructor() { }

  ngOnInit() {
    this.randomize();
  }
  randomize(){
    this.doughnutChartData = [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
    ]
  }

}
