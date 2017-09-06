import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  url:string = '';
  hasNext:boolean = false;
  hasPrev:boolean = false;
  numberOfPages = [];

  resultsPerPage:number = 10;
  count:number = 0;
  _count:number = 0;
  current:number = 1;
  _current:number = 1;

  queryParams : {[k:string]: any} = {}
  nextQueryParams : {[k:string]: any} = {};
  prevQueryParams : {[k:string]: any} = {};

  @Input('resultsPerPage')
  public set setResultsPerPage(value:number){
    this.resultsPerPage = value;
    this.updateView();
  }
  @Input('count')
  public set setCount(value:number){
    this._count = value;
    this.updateView();
  }

  public setCurrent(value:number){
    this._current = value == null ? 1 : value;
    this.updateView();
  }

  private updateView(){
    if(isNaN(this._count)) this._count = 1;
    this.current = Math.ceil(this._current / this.resultsPerPage);
    this.count = Math.ceil(this._count / this.resultsPerPage);
    if(isNaN(this.count) || this.count == 0) this.count = 1;
    this.numberOfPages = Array(this.count).fill(0);
    this.verifyNextPrev();
  }

  private verifyNextPrev(){
    if(isNaN(this.current)) this.current = 1;
    if(isNaN(this.count)) this.count = this.current;
    let init = this.current * this.resultsPerPage;

    this.nextQueryParams = {};
    this.prevQueryParams = {};
    this.hasNext = !(this.current == this.count);
    this.hasPrev = !(this.current == 1);
    if(this.queryParams.query){
      this.nextQueryParams.query = this.queryParams.query;
      this.prevQueryParams.query = this.queryParams.query;
    }

    if(this.hasNext){
      this.nextQueryParams.from = init;
      this.nextQueryParams.to = this.resultsPerPage;
    }

    if(this.hasPrev){
      this.prevQueryParams.from = init - this.resultsPerPage * 2;
      this.prevQueryParams.to = this.resultsPerPage;
    }

  }

  getQueryParam(i:number){
    if(!this.queryParams) this.queryParams = {};
    let init = i * this.resultsPerPage;
    var queryParams : {[k:string]: any} = {};
    queryParams.from = init;
    queryParams.to = this.resultsPerPage;
    if(this.queryParams.query) queryParams.query = this.queryParams.query;
    return queryParams;
  }

  constructor(private route:Router,
              private activatedRoute:ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(data=>{
      this.setCurrent(+data.from + 1);
      this.updateView();
      this.queryParams = data;
    });
    /*var rootUrl:string[] = [];
    var snapshot = this.activatedRoute.snapshot;
    do{
      let value = snapshot.url.join('');
      if(value) rootUrl.push(value);
    }while(snapshot = snapshot.parent);
    this.url = rootUrl.reverse().join('/');*/
  }

}
