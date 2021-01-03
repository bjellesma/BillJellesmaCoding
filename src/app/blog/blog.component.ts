import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, ROUTES} from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import {combineLatest} from 'rxjs'
import { map, pluck } from 'rxjs/operators';

declare var ng: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.Emulated

})
export class BlogComponent implements OnInit {
  activatedRoute: any;
  
  ngOnInit() {}
  $blogPostMetadata = combineLatest([
    this.route.params.pipe(pluck('slug')),
    this.scully.available$
  ]).pipe(
    map(([slug, routes]) =>
      routes.find(route => route.route === `/blog/${slug}`)
    )
  );
  constructor(private scully: ScullyRoutesService, private router: Router, private route: ActivatedRoute) {
  }
}
