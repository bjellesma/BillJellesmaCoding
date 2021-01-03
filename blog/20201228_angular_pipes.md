---
title: 'Angular Pipes: A quick tutorial'
date: '2020-12-30 20:45:00'
updateTime: '2020-12-30 20:45:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20201104_angular_cheat_sheet.png'
tagline: "Great idea to quickly transform text"
unpublished: False
tags:
- Angular
- Angular Material
- UI
---

Pipes are a useful tool in Angular. I've briefly talked about using a couple of the built in pipes in my [Angular Concepts Post](https://billjellesmacoding.netlify.app/angular-concepts#pipes) but it's also very easy to make your own custom pipes to transform the data in whatever way you may need. Just as components, modules, etc., Angular has the tools so that you can create a pipe quickly and easily using the Angular CLI. 

In this short tutorial, we'll just create a custom pipe that will transform some text that we receive from an API into something a little bit more friendly. We're outputting our data to a table.

1. First, we'll create an Angular Material table. I've previously discussed creating a table in my [Angular Material Post](https://billjellesmacoding.netlify.app/angular-material#table). Below is the template html

```html
<table mat-table matSort [dataSource]="dataSource" class="mat-elevation-z8">
  <ng-container [matColumnDef]="column" *ngFor="let column of displayedColumns">
    <th mat-header-cell mat-sort-header={{column}} *matHeaderCellDef> {{column}} </th>
    <td mat-cell *matCellDef="let element"> {{element[column]}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="columnsToDisplay"></tr>
  <tr mat-row *matRowDef="let row; columns: columnsToDisplay;"></tr>
</table>
```

And below is the corresponding component class

```js
import { Component, OnInit} from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(){}
  displayedColumns: string[] = ['name', 'weight', 'symbol', 'position'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = ELEMENT_DATA
  ngOnInit() {}
}

```

Your output should look like this:

![Angular Material Table](../../assets/images/20201230_table.png)

2. Use the Angular CLI to create a new pipe with `ng g p pipes/prettyLookup`.

The `pretty-lookup.pipe.ts` file will look like below with a standard boilerplate. `transform` is the function that will be performed whenever the pipe is used. `value` will be the parameter that the transform is done to. `...args` will be any parameters that you wish to specify after the colon when defining the pipe.

```js
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettyLookup'
})
export class PrettyLookupPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
```

3. Let's modify two lines of the html to make use of the pipe.

```html
<th mat-header-cell mat-sort-header={{column}} *matHeaderCellDef> {{column | prettyLookup}} </th>
    <td mat-cell *matCellDef="let element"> {{element[column] | prettyLookup}} </td>
```

Now every element of the table will have their text transformed by the `prettyLookup` pipe. Take a look.

![Angular Material Table](../../assets/images/20201230_table_transformed.png)

Saying hello in your table is very polite but is not very useful for any application that we'd like to build. Let's take this a step further, let's say that we want our table headings to be in spanish. Let's do that by creating a simple lookup object.

4. Modify the pipe code to include a lookup object

We'll create a spanish lookup object so that we can use the english names as keys and the spanish names as values. We'll also modify the transform function to use this spanishLookup object to return the corresponding spanish name. If the value is not found is our object, we'll simply return the original value. 

```js
export class PrettyLookupPipe implements PipeTransform {

  spanishLookup = {
    'name': 'nombre',
    'weight': 'peso',
    'symbol': 'símbolo',
    'position': 'posición'
  }

  transform(value: string, type: string): unknown {
    let prettyLookup = this.spanishLookup[value]
    if(!prettyLookup){
      return value
    }
    return prettyLookup
  }

}
```

Now, take a look at the table being rendered

![Angular Material Table](../../assets/images/20201230_table_transformed_spanish.png)

Notice that we also added a `type` parameter to our function. This is so that we can even take the pipe one step further and choose between a spanish and french translation.

5. Modify the pipe once more to include a french lookup object. The function will also use a simple if statement to get the type of translation that the user wants.

```js
export class PrettyLookupPipe implements PipeTransform {

  spanishLookup:object = {
    'name': 'nombre',
    'weight': 'peso',
    'symbol': 'símbolo',
    'position': 'posición'
  }

  frenchLookup:object = {
    'name': 'Nom',
    'weight': 'poids',
    'symbol': 'symbole',
    'position': 'position'
  }

  transform(value: string, type: string): unknown {
    let prettyLookup:string = '' 
    if(type=="spanish"){
      prettyLookup = this.spanishLookup[value]
    }else if(type=="french"){
      prettyLookup = this.frenchLookup[value]
    }
    if(!prettyLookup){
      return value
    }
    return prettyLookup
  }

}
```

6. Modify the template html to include the `'french'` parameter.

```html
<th mat-header-cell mat-sort-header={{column}} *matHeaderCellDef> {{column | prettyLookup:'french'}} </th>
```

Notice that the parameter must be quoted because we are passing a string.

Now, take a look at the rendered table. We can also pass the `'spanish'` string as a parameter in the html above to receive the spanish translations. We can even pass no parameter to have the table headings remain in English.

![Angular Material Table - French](../../assets/images/20201230_table_transformed_french.png)

## Summary

Pipes are a powerful tool in Angular. The data in the example above was hardcoded to the component class but if we're receiving the data from an API, we're unable to transform the data at the source. This could be where Angular Pipes jump into action.