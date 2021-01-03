---
title: 'Angular Cheat Sheet'
date: '2020-11-04 20:45:00'
updateTime: '2020-11-09 20:45:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20201104_angular_cheat_sheet.png'
tagline: "Let's memorize the CLI commands together"
unpublished: False
tags:
- Angular
---

I wanted to make a quick reference guide that I can refer to as I use Angular more and more. These are meant to be some general tips that I've found that don't apply to any specific project.

## CLI Commands and Switches

* `ng new <project name>` will start a new project 
  * Optionally you can choose to include the angular router when installing this
* `ng serve` when executed in a project directory will serve the application in a development mode and with hot reloading on the default port of 4200. `--port` is a switch used to change the port number (this may be useful if you have two projects open at once). `--open` will open the `localhost:4200` (or whichever port you've chosen) in a new tab.
* `ng generate component <component_name>` (`ng g c <component_name>` for short) will generate the component in the `/src/app` folder 
* `ng generate service <service_name>` (`ng g s <service_name>`) will generate  a service in the `/src/app` folder 
* `ng generate module <module_name>` (`ng g m <module_name>`) will generate a module in the `/src/app` folder.
  * You can use `--flat` to generate the file directly in the `src/app` folder rather than the CLI creating its own folder for the module.
  * `--module=app` will automatically register the module in the `imports` array of `app.module.ts`
* Always use `--dry-run` when generating a component or service to make sure that the directory is where you want it. I know personally that I've created components in the wrong folder before.

## Tips

### HTTP Routing

To add http routing to your application (to go out to other resources on the internet)
  1. add an import in `app.module.ts`
  ```js
  import { HttpClientModule} from '@angular/common/http';
  ```
  2. add the client module to the list of imports in `app.module.ts`
  ```js
  ,
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  ```
  3. In the service where you want to use http methods, import the http client
  ```js
  import { HttpClient } from '@angular/common/http';
  ```
  4. Initialize and http object in the constructor of the services class
  ```js
  constructor(private http:HttpClient) { }
  ```
  5. You can now reference the http object within that service by using 
  ```js
  this.http
  ```

### Deleting components

To delete a component from your project (this is also important why you should use the `--dry-run` flag), follow the following process:
  1. Delete the folder containing the component
  2. In `app.module.ts`, delete both the import and the declaration under `declarations`


### Working with Forms

* If you want to work with forms in your application, you'll need to add the forms module by adding an import to `app.module.ts`. Add an import statement at the top of the file and add the module to the imports list on `@NgModule`

```js
import{FormsModule} from '@angular/forms'
```

```js
imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
```

* When creating the form in html, use the `[(ngModel)]` attribute on a form input to bind it to a class property of the same name on the `component.ts` file

For Example, If you want the input `fullName` to bind to the class property `fullName` of the class, you will need the following html

```html
<input type="text" name="name" id="fullName" [(ngModel)]="fullName">
```
As well as to declare a class property on the component:

```js
export class AddActorComponent implements OnInit {

  fullName:string;
  ...
```

You can now access that variable in that class using the `this` keyword

```js
onSubmit(){
    console.log(this.fullName)
  }
```