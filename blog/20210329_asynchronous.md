---
title: 'Angular Observables in HTTP and Asynchronous Programming'
date: '2021-03-29 23:45:00'
updateTime: '2021-03-29 23:45:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20210329_asynchronous/angular-http-observables.png'
tagline: "The kind of subscriptions that have nothing to do with youtube"
unpublished: True
tags:
- Angular
- RxJS
---

Observables are mentioned briefly in my [Angular Concepts post](https://billjellesmacoding.netlify.app/blog/20201109_angular_concepts) but I wanted to dive a little deeper into this concept. Along the way to using observables in http are the concepts of asynchronous programming, ajax, and promises.

# TL;DR

* Asynchronous Programming has been built into JavaScript for many years and may seem more confusing than helpful compared to traditional synchronous code.
* Callback hell is an easy trap to fall into but should be avoided chiefly because of the lack of code readability
* Promises make use of `async await` to help developer use the code in a synchronous way
* Observables are very powerful compared to jQuery AJAX requests and promises chiefly because we're able to cancel http requests.

# A light intro to Asynchronous Programming in Javascript

Javascript takes advantage of using asynchronous programming when making http requests. Most programming that we're used to when coming from backgrounds of C++ and Python is synchronous, meaning one task must be completed before another task can begin. This is good for procedural code that relies on the logic of previous statements. However, when using the browser and HTTP requests, forcing the rest of the app to wait for an http call to complete can be bad for performance, making for a bad overall user experience. **Asynchronous Programming** will allow for other code to still run while your http calls may still be completing. 

# Asynchronous JavaScript and XML (AJAX)

When I first learned to make http calls in JavaScript in 2011, a technique called AJAX (asynchronous javascript and xml) was used to get data via an http call. The advantage of using AJAX was that you could still have code on the page to let the user know that something was happening, like a spinner. The call would also be made without the page needing to be refreshed. This was huge because you could start using a click event on a button to submit a form and get data back in real time without going the traditional route of using a submit element on a form.

![spinner](../../assets/images/20210329_asynchronous/spinner.gif)

This worked very well with jQuery, an extremely popular framework of javascript. It also confused me a lot because it was not was I was used to coming from C++ and Python. In the following code, I would expect the http call to either succeed or fail and then run the code after. 

```html
<script>
$(document).ready(function(){
    $("button").click(function(){
        $.ajax({
                url: "demo_test.txt", 
                success: function(result){
                    console.log(result);
                }, 
                error: function(error){
                    console.log('The call failed');
                }
        });
        console.log('This text runs after')
    });
});
</script>
<div id="div1">
    This text will change when the button is clicked
</div>

<button>Click me!</button>
```

![Failed Call](../../assets/images/20210329_asynchronous/call_failed.gif)

Notice that the success and error options define a function. JavaScript will allow the user to define a function on the spot without giving it a name because they are known as **anonymous functions**. Specifically, when these anonymous functions are defined on the success and/or error options of an ajax call, they are known as **callback functions**.

Instead you can see that "This text runs after" is logged to the console before any success or failure from the ajax call. It's contrary to what you might think but can be useful in the case where the http call times out because you can still have code run. The obvious option here might be to define all of the code that you want to run after the call returns inside of your callback functions. You can even call other functions inside of those functions.

```html
<script>
$(document).ready(function(){
    $("button").click(function(){
        $.ajax({
                url: "demo_test.txt", 
                success: function(result){
                    console.log(result);
                    // making a function call inside of our callback
                    doSomething(result);
                }, 
                error: function(error){
                    console.log('The call failed');
                }
        });
        console.log('This text runs after')
    });
});
</script>
<div id="div1">
    This text will change when the button is clicked
</div>

<button>Click me!</button>
```

This type of code quickly became very difficult for other developers (and yourself two weeks later) to follow and became known as **callback hell**. The name is quite indicative of the type of torture that it would cause.

# Observables in Angular

Gradually, frontend development has shifted from using jQuery to using dedicated frontend frameworks such as Angular, React, and Vue. Angular, my personal frontend framework, makes use of observables.

Observables are part of a larger package bundled with Angular called RxJS and are used frequently with the **HttpClientModule** of JavaScript. When following an Angular tutorial, you'll often see code to request a resource written like this.

```ts
getPost(id){
    const url = `'https://jsonplaceholder.typicode.com/posts/${id}`
    return this.httpClient.get(url)
}
```

This method `getPost()` will return an observable. Because of Angular's use of typescript, you can see this very easily when we properly type everything.

```ts

interface Post {
    id: number,
    title: string,
    body: string
}

getPost(id:number): Observable<Post>{
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`
    return this.httpClient.get<Post>(url)
  }
```

The concept of interfaces is beyond the scope of this article but it basically just defines the objects that are to be returned in the observable.

When learning to use the HttpClientModule, you probably found out that you cannot just call the method like the following.

```ts
// code before
const post = this.postService.getPost(1)
// code after
```

That code does not work because the HttpClientModule makes use of asynchronous programming to return an observable. An **observable** can be thought of as an open data stream. Observables offer very powerful method such as `.subscribe()` and `.unsubscribe()`. The code that you would actually use the get the post would be like the following:

```ts
this.postService.getPost(id).subscribe((post) => {
    this.post = post
})
```

Basically, you're subscribing to this observable and setting the post on the component (`this.post`) to the value of the returned `post`. You will also handle errors in a more elegant way by simply defining the second argument for the `subscribe`.

```ts
this.postService.getPost(id).subscribe((post) => {
      this.post = post
    }, (err) => {
      console.log('An error has occurred trying to get the post')
    })
  }
```

The `.unsubscribe()` method of observables is very nice because it will allow you to cancel an HTTP request. Let's say for example that you'd like to create a button that will close your observable so that it no longer queries the server.

```ts
ngOnInit(){
    this.subsciption = this.postService.getPost(id).subscribe((post) => {
      this.post = post
    }, (err) => {
      console.log('An error has occurred trying to get the post')
    })
  }
}

onClick(){
    this.subscription.unsubscribe()
  }
```

# Resolution to callback hell

There is still one glaring issue with observables that may not be clear on first glance: How do we avoid callback hell? Again users might be tempted to stuff the rest of their code into the `subscribe()` method, but this will quickly make unreadable code for yourself again. If you have code such as the following, `this code should run last` will still be output before anything else in the subscription.

```ts
this.postService.getPost(3000).subscribe((post) => {
      this.post = post
    }, (err) => {
      console.log('An error has occured trying to get the post')
    });
    console.log('this code should run last')
```

Observables build on top of a previous JavaScript technique called promises. **Promises** were a feature added to JavaScript as an attempt to, in addition to having more elegant and readable syntax, avoid becoming engulfed in callback hell. Furthermore, developers saw an easier way to work with asynchronous code in ECMAscript 2017 with the introduction of `async await`. **async await** is an easy way to define a function with the `async` keyword and tell it to wait for any promise to complete with `await` before proceeding with anymore code. From its inception, RxJS sought to make observables and promises very interoperable. This means that any observable can be converted to a promise with the `.toPromise()` function.

Making use of `toPromise()` and `async await`, we can redefine the method that makes the HTTP call to return a promise instead.

```ts
getPost(id:number): Promise<Post>{
    const url = `${this.postsUrl}/${id}`
    return this.httpClient.get<Post>(url).toPromise()
  }
```

Now, the component `ngOnInit` can be defined with the `async` keyword. Since we're not using a promise, we simply have to change the `.subscribe()` function to `.then()`. As you can see, `.then()` takes the same arguments, but now that we're using a promise, we're able to use `await` to ensure that the promise completes before `this code should run last` is output to the console.

```ts
async ngOnInit(){
    await this.postService.getPost(id).then((post) => {
      this.post = post
    }, (err) => {
      console.log('An error has occurred trying to get the post')
    });
    console.log('this code should run last')
  }
```
