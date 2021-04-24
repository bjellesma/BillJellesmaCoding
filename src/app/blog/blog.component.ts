import {Component, OnInit, ViewEncapsulation, AfterViewChecked} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import {combineLatest} from 'rxjs'
import { map, pluck } from 'rxjs/operators';
import {SyntaxHighlightService} from '../services/syntax-highlight.service'

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
  blogTitle: string;
  blogDate: string;
  blogAuthor: string;
  blogImage: string;
  
  ngOnInit() {
  }
  
  // combineLatest will get the latest values emitted from the available$ observable and the slug property
  $blogPostMetadata = combineLatest([
    //pluck will extract the 'slug' property from route
    this.route.params.pipe(pluck('slug')),
    this.scully.available$
  ]).pipe(
    //rxjs map will then filter so that the route matches /blog/:slug so that we turn that in blogPostMetaData$
    map(([slug, routes]) => {
      
      return routes.find(route => {
        return route.route === `/blog/${slug}`
      })
    })
  ).subscribe(data => {
    this.blogImage = data.image
    this.blogTitle = data.title 
    this.blogAuthor = data.author
    this.blogDate = data.date
  })
  //use prism highlighting for syntax highlighter
  ngAfterViewChecked() {
    this.highlight.highlightAll();
  }
  constructor(private scully: ScullyRoutesService, private route: ActivatedRoute, private highlight: SyntaxHighlightService) {
  }
}
