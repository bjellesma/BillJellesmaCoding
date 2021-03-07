import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//needed for apollo
import {APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScullyLibModule } from '@scullyio/ng-lib';
import { HeaderComponent } from './components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AboutComponent } from './components/about/about.component';
import { createApollo, GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import {GraphQLComponent} from './components/graphql-test/graphql-test.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    GraphQLComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ScullyLibModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
