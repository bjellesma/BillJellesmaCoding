import {Component, OnInit} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-graphql-test',
  templateUrl: './graphql-test.component.html',
  styleUrls: ['./graphql-test.component.css']
})
export class GraphQLComponent implements OnInit {
  authorName = ''
  loading = true;
  error: any;
  private querySubscription: Subscription;
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            author{
              fullName
            }
          }`,
      })
      .valueChanges.subscribe(({data, loading}) => {
        this.loading = loading;
        // this.authorName = data?.author.fullName;
        // console.log(`resourse loaded: ${JSON.stringify(data)}`)
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}