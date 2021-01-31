import { Component, OnInit } from '@angular/core';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Sort
  // added from https://gitter.im/scullyio/community?at=5e3122fa58f02e34973d0739
  blogs$ = this.scully.available$.pipe(
    map(routeList => {
      return routeList.filter((route: ScullyRoute) => route.route.startsWith(`/blog/`))
    }),
    map(blogs => blogs.sort((a, b) => (a.updateTime > b.updateTime ? -1 : 1)))
  );
  routes$: Observable<ScullyRoute[]> = this.blogs$
  
  //inject the scully routes
  constructor(private scully: ScullyRoutesService) {}

  ngOnInit() {

    // debug current pages
    this.routes$.subscribe((routes) => {
      routes.filter(route =>
        route.route.startsWith('/blog/') && route.sourceFile.endsWith('.md')
      );
    });
  }
}