---
title: 'Angular Concepts'
date: '2020-11-10 20:45:00'
updateTime: '2020-11-13 00:30:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20201104_angular_cheat_sheet.png'
tagline: "Angular has it's own slew of confusing terms"
unpublished: False
tags:
- Angular
---

## Table of Contents

* [Components](#components)
* [Interfaces](#interfaces)
* [Pipes](#pipes)
* [Two Way Binding](#binding)
* [ngFor and ngIf](#ngfor)
* [Private Styles and Class Binding](#styles)
* [Event Binding](#event-binding)
* [Input](#input)
* [Services](#services)
* [Routers](#routers)
* [HTTP](#http)

A fond memory of mine is coming how from school and making flash cards until I was too tired to make anymore. That being said, I'm sure the memory was more painful than I remember. Well, I figured that I'd need to upgrade my process for the new age so here we go.

**workspace** - Contains the files for one or more projects

**Project** - the set of files that comprise an app, a library, or an end-to-end test

## <a name="components">Components</a>

A **Component** is Fundamental building blocks of Angular applications. They display data on the screen, listen for user input, and take action based on that input. A component will always contain the `@Component` annotation.

*Sidenote*: Every component must be declared in exactly one NgModule decorator (more on decorators below). An example of declaring the Heroes Component from the tour of heroes app is shown below. Fortunately, the work of importing and declaring the component are done for you when using the CLI (more information on using the CLI to generate components is available in my [Angular Cheat Sheet](https://billjellesmacoding.netlify.app/angular-cheat-sheet) article).

```js
@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

*2nd Sidenote*: When a component becomes large and serves multiple purposes, you should consider refactoring that one component into two or more components. Taking from the Angular tour of heroes example, the heroes component eventually contains both a list of heroes and then a toggleable details section for the heroes. Since the component is now serving more than one purpose, hosting the list and details, it is recommended that you seperate this into a hero component and a hero-detail component. This has the advantage that the detail is reusable so that you can use it on different parts of the app and is more maintainable as you know that working on the detail component will only affect the detail component.

**Interpolation Binding** - This is the double curly braces that appear in a component's template. These are defined in the component's typescript file and sent to the template. For example

```html
<h1>{{title}}</h1>
```

In addition to Interpolation Binding, you can also use **Template Reference** variables to create variables directly in the templates.

```html
<button #toggleButton>Button Toggle</a>
```

**src/styles.css** is a file where application wide styles are meant to be placed to make the styles consistent across the entire application

**Decorator Function** - specifies the Angular metadata for the component, module, directive, etc. An example would be that a component will always be created with the `@Component` decorator function, as seen below. When you choose to create a decorator on your own, you are **annotating** the class.

```js
@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
```

In the above decorator function, we have the following metadata properties:
* selector is the **component's CSS element selector**. `app-component` matches the name of the HTML element that identifies this component within a parent component's template.
* templateUrl is the location of the **component's template file**
* styleUrls is the location of the **component's private CSS styles**

**ngOnInit()** is a lifecycle hook and is called shortly after creating the component. **constructors** should do no more than initialize local variables and should NOT fetch data from external sources. For fetching data from an external source such as a server, you should use `ngOnInit()` to call a service (defined below). You can read more about Component Lifecycles by visiting [https://angular.io/guide/lifecycle-hooks](https://angular.io/guide/lifecycle-hooks)

## <a name="interfaces">Interfaces</a>

An interface is like a blueprint to explain the type that a javascript object should conform to and of what type each property of the object should be. Because Angular uses typescript (just another layer on top of javascript, completely compatible with javascript), objects can use these interfaces for type checking. If used, the object will throw an error to the compiler if the object is not of the type specified by the interface. For example (the example from the tour of heroes tutorial), if you have the following interface:

```js
export interface Hero {
  id: number;
  name: string;
}
```

and then later on have a hero object defined as the following. Notice the `: Hero` is typescript feature forcing type checking on the object. Remember to import the interface if it's in a separate file.

```js
import {Hero} from '../models/hero'

hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };
```

*Sidenote* import this Hero interface can also be referred to more generally as importing a **symbol**

The compiler will throw an error if you try to use

```js
hero: Hero = {
    id: 1,
    name: 2
  };
```

Because you've changed the name property to be of type number.

Interfaces are usually created in their own files and are not generated by the CLI. I like to use one interface (maybe multiple if I have similar types (hero and heroes)) per file and create those files in a folder I create called `src/app/models`.

## <a name="pipes">Pipes</a>

**Pipes** are simple functions used in template expressions (such as interpolation bindings) to accept an input value and transform it to a specified output. Pipes can be used to transform strings, currency amounts, dates, and other data for display. For example, the tour of heroes app in the angular docs will have you create an object

```js
hero = {
  id: 1,
  name: 'windstorm'
}
```

but use the built in UppercasePipe when displaying it in a template

```html
<div><span>name: </span>{{hero.name | uppercase}}</div>
```

so that it renders as `WINDSTORM` rather than `windstorm`

You can find more information one using parameters to specify date codes with the date pipe, chaining pipes, and creating custom pipes by visiting [https://angular.io/guide/pipes](https://angular.io/guide/pipes). You can find a full list of built in pipes by visiting [https://angular.io/api/common#pipes](https://angular.io/api/common#pipes).

## <a name="binding">Two Way Binding</a>

**Two Way Binding** means that the data can flow in two directions. At Angular's core, this means the data and the model (class) will always be in sync. This is done using a directive in angular known as **ngModel**. In order to use this directive, we first need to import the FormsModule into our `app.module.ts` file. **FormsModule** is where the ngModel directive is defined and is not included by default when you start a new project but is very easy to import.

1. In `app.module.ts`, import the FormsModule using the following syntax at the top of the file

```js
import { FormsModule } from '@angular/forms';
```

2. The FormsModule must be included in the imports array of the NgModule decorator, also in `app.module.ts`

```js
@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

Now, back in `heroes.component.html`, we can include an input textbox with the ngModel directive. Angular's syntax for two way data binding is `[()]` so don't forget to include the ngModel directive in this.

```html
<div>
    <label>name:
      <input [(ngModel)]="hero.name" placeholder="name"/>
    </label>
  </div>
```

Now, whenever we type a new name in the textbox. The displayed name above that will change.

![Two Way Data Binding](../../assets/images/20201111_angular_concepts/two-way-binding.gif)

## <a name="ngfor">ngFor and ngIf</a>

A useful feature for any framework is to be able to loop through an object. In Angular, we can accomplish this with an **ngFor**, angular's **repeater** directive. This is a directive that, when attached to an element, will repeat the element for the entire list. Using angular's tour of heroes app again, let's define a list called `heroes` inside `heroes.component.ts` inside of the class.

```js
export class HeroesComponent implements OnInit {

  heroes = [
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
```

We can then iterate over this list in `heroes.component.html` by attaching `*ngFor='let hero of heroes` Notice that we're using an * character before the directive name and a javascript let statement. Inside of the element with the directive, we can interpolate hero and any property on hero

```html
<ul class="heroes">
  <li *ngFor="let hero of heroes">
    <span class="badge">{{hero.id}}</span> {{hero.name}}
  </li>
</ul>
```

The ngIf directive is similar to ngFor in that it brings a dynamic programming like construct to template files. **ngIf** can be used to display a certain element or even a whole section only if the condition is true. For example, if we have a div element in our html that we only want to display if the `selected` element is equal to 3, we would use the following

```html
<div *ngIf="selected == 3">
  <p>Hello World</p>
</div>
```

Then the div element and its child paragraph element would only be shown if selected is equal to 3.

## <a name="styles">Private Styles and Class Binding</a>

When you use the CLI to generate a component, heroes, angular also generates a css file, `heroes.component.css`. This stylesheet has what's referred to as **private styles** because those styles only apply to that component. For example, if in `heroes.component.css` we define

```css
.container {
  background:blue;
}
```

The style for the container class will not apply if you have another container class defined in another component, `villians.component.html`

**Class Binding** will allow you to attach a class to an element dynamically if and only if a certain condition is met. Think of class binding as being similar to ngIf defined above in that it takes an action only if a certain condition is met. For example, the below element will only use the active class if selected is equal to 3.

```html
<li [class.active]="selected == 3">
```

Notice the syntax is to add [] around this directive and include the word class. This is to distinguish class binding from style and attritute binding. You can read more about class, style, and attribute binding by visiting [https://angular.io/guide/attribute-binding#class-binding](https://angular.io/guide/attribute-binding#class-binding)

## <a name="event-binding">Event Binding</a>

Events occur whenever a user interacts with an element such as by clicking it, or inputting text. Angular has it's own **Event Binding** syntax to handle these events. The syntax is similar to any other directive except you want to use parentheses around the directive.

```html
<li (click)="onClick(hero)">
```

In the above example, we've attached a click event to the `li` element which will call the `onClick()` method defined in the component class and pass in hero as the argument. For more information about event binding syntax as well as more advanced concepts of creating custom events with `EventEmitter`, visit [https://angular.io/guide/event-binding](https://angular.io/guide/event-binding)

## <a name="input">Input</a>

An **Input** can be used to pass data from one component to another within the same project. For example, the tour of heroes app has two components, hero and hero-detail, of which the hero component will let you select the hero while the hero-detail will render details on the selected hero from the hero component. In order to get the selected hero from the hero component to the hero-detail component, we make use of an input on the hero-detail component. This allows us to pass the selected hero in a special input directive on the selector fro the hero-detail component.

```html
<app-hero-detail [hero]="selectedHero"></app-hero-detail>
```

Notice that the input `hero` is in square brackets and is set equal to the `selectedHero` a variable defined in the hero component class, `hero.component.ts`. More generally, directives like this are known as **Property Binding** and you can learn more about this by visiting [https://angular.io/guide/property-binding](https://angular.io/guide/property-binding)

On the hero-detail component class, `hero-detail.component.ts`, we'll need to import Input since it's not imported by default, and define the Input as a variable on the class using the `@Input` decorator syntax.

```js
import { Input } from '@angular/core';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero;
  ...
}
```

*Sidenote* Because the hero component will allow the user the selection of a hero while the hero-detail will show the detail of the selected hero, it may be referred to as **parent/child** relationship where the hero is the parent and the hero-detail is the child.

*2nd Sidenote* Angular also has the concept of **Outputs** and more one-way binding which can be read more about by visiting [https://angular.io/guide/inputs-outputs](https://angular.io/guide/inputs-outputs)

## <a name="services">Services</a>

Following the dependency injection architecture of Angular, data that you wish to display should be defined in a **Service** rather than in a component. This helps make code more maintainable because if you ever want to change how you receive the data, you only have to change the service that the data is defined in, rather than potentially multiple components. Services must be made available to Angular's dependency injection system through **Providers**. When using the Angular CLI to register a service, Angular will register a provider with the root injector. This can be seen in the `@Injectable` decorator.

```js
@Injectable({
  providedIn: 'root'
})
```

Now, in a component class that you want to use methods defined in a service, you inject the service in a constructor of a component. **Injection** follows Angular best practices in that it will load the service as a dependency at runtime of the component. To use Angular's tour of heroes example again, the hero component will inject the hero service into its constructor.

```js
...
export class HeroesComponent implements OnInit {
  heroes
  constructor(private heroService:HeroService) { }
  ...
```

The above definition will make all of the methods and variables of `HeroService` available through the private declaration `heroservice` and can be accessed just as any other class definition using the `this` keyword. The declaration is **private** if it is only intended to be used in the class that it's defined in. The declaration will be **public** if we intend to use the service in other features of the component such as the component template. For example, the `getHeroes()` method is accessed and assigned to `heroes` with the following

```js
this.heroes = this.heroService.getHeroes();
```

`getHeroes()` in `hero.service.ts` is defined to get a constant that we've defined which makes this a **synchronous** operation which is why the above assignment works.

```js
getHeroes(): Hero[] {
    return [
      { id: 11, name: 'Dr Nice' },
      { id: 12, name: 'Narco' },
      { id: 13, name: 'Bombasto' },
      { id: 14, name: 'Celeritas' },
      { id: 15, name: 'Magneta' },
      { id: 16, name: 'RubberMan' },
      { id: 17, name: 'Dynama' },
      { id: 18, name: 'Dr IQ' },
      { id: 19, name: 'Magma' },
      { id: 20, name: 'Tornado' }
    ];
  }
```

When `getHeroes()` is defined to get data from a real external source, the data will need to be retrieved asynchronously using a subscription or promise. This is because most of the time, service methods such as `getHeroes()` will use `HttpClient.get()` which returns an observable that must be subscribed to. For just talking about services, using the synchronous operation of retrieving a constant works.

## <a name="routers">Routers</a>

An Angular **Router** is a special module that imports certain routing properties and registers an array of objects (routes and components) that you define. The easiest way to get up and running with a router is to select it from the start. When you create the app with the CLI via `ng new <project>`, the CLI will ask you if you want a router. 

If you didn't select to include routing, you can still use the CLI to create a new module with `ng g m app-routing --flat --module=app`. This will create an `app-routing.module.ts` file in `src/app` and will register the module in the imports array of `app.module.ts`. You will also want to import the router, define a routes array, add `RouterModule.forRoot(routes)` to the imports array, and add `RouterModule` to the exports array. The end result should look like the following. The `forRoot()` is a special method on the `RouterModule` that will register the array of routes that you've defined.

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Within this file, also import any components that you want to be included in the router. Each element in the routes array will be an object of `{path:path, component:component}` where path will be the relative path that you want to make the component available on and the component will be the component that you'd like to display.

```js
const routes: Routes = [
  { path: 'heroes', component: HeroesComponent }
];
```

Additionally, we can add an object that will redirect to another path. In the following code, we add an object so that if the user navigates to `/`, they will be redirected to `/heroes`

```js
const routes: Routes = [
  { path: '', redirectTo: '/heroes', pathMatch: 'full'},
  { path: 'heroes', component: HeroesComponent }
];
```

Another useful feature of the Angular Router is to add a **parameterized route** so that the route can have a placeholder that is filled in at runtime. Angular uses a colon to distinguish parameters.

```js
{ path: 'detail/:id', component: HeroDetailComponent },
```

As for the template file, in order to create a link to this component, you will use the following, `routerlink` is a special attribute that should be the same as one of the paths in the path array above.

```html
<nav>
    <a routerLink="/heroes">Heroes</a>
</nav>
```

For the parameterized route mentioned earlier, you would use regular interpolation to pass the variable.

```html
<nav>
    <a routerLink="/details/{{hero.id}}">Hero details</a>
</nav>
```

Finally, Angular's `<router-outlet>` is used in the template for where you want the component that you've navigated to to appear. Because Angular reuses as many components as possible in favor of performance, if the user types a new route in the address bar of the browser (`/heroes`), Angular will only replace where router-outlet is defined.

```html
<!-- router outlet will tell angular where to display the routed view -->
<router-outlet></router-outlet>
```

When you're using parameterized routes, the information in the route may become useful for your component. For example, if you use the above parameterized route, navigating to `/details/11` will mean that the component will need to get a hero with the id of 11. In order to get the information in the route, we'll inject a service called `ActivatedRoute` and get the parameter id by getting it from the `parammap` dictionary provided by the service.

```js
import { ActivatedRoute } from '@angular/router'; // used to get the current route
...
export class HeroDetailComponent implements OnInit {

  ...

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    //+ converts the returned string to a number
    const id = +this.route.snapshot.paramMap.get('id');
    ...
  }

  ...

}
```

## <a name="http">HTTP</a>

In order to get resources from the web, the **HttpClientModule** is used to send requests and receive responses. You'll first want to import this module into your `app.module.ts` file and add it to the `imports` array of the `@NgModule` decorator. Importing this module will make it available throughout your entire app.

```js
import { HttpClientModule } from '@angular/common/http';
```

```js
@NgModule({
  imports: [
    HttpClientModule,
  ],
})
```

You'll need to inject the `HttpClient` Service where you plan to use it

```js
import { HttpClient } from '@angular/common/http';
```

```js
constructor(private http: HttpClient) { }
```

You can now use this defined `http` variable to call on a web service. In the following example, we're making a GET request. Notice that this GET request will return as RxJS Observable. This means that we will need to subscribe to this method call. `url` is a variable that we've defined above as a string like `http://example.com` and we're type checking the returned observable as the generic `object[]`

```js
getHeroes(): Observable<object[]> {
  return this.http.get<object[]>(this.url)
}
```

Error handling for this specific api request can be done using the RxJS `catcherror()` operator. The `catcherror()` operator will listen for any errors and return this to `handleError()`. `handleError()` is a private method that we've defined that will log the message to the console and then keep going.

```js
import { catchError } from 'rxjs/operators';
```

```js
getHeroes(): Observable<object[]> {
    return this.http.get<object[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError<object[]>('getHeroes', []))
      );
  }
```

```js
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
```

If your API requires you to use certain headers when making requests, you can make these by creating an object called **HttpHeaders** that will hold the http headers in an object.

```js
import { HttpHeaders } from '@angular/common/http';
```

```js
httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
```

Notice that, unlike services, we are not using dependency injection and are instead using the new keyword to create an object. This is because the headers object must be instantiated with the headers.

