---
title: 'Serverless Graphql with Netlify Lambda and Apollo Angular'
date: '2021-0306 20:45:00'
updateTime: '2021-03-06 20:45:00'
author: 'Bill Jellesma'
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20201104_angular_cheat_sheet.png
tagline: 'Where we''re going, we don''t need servers'
published: false
tags:
    - Netlify
    - Angular
    - Apollo
    - Serverless
slugs:
    - ___UNPUBLISHED___klzfjfao_WyQpbMDkv2ol4uaPnqhrsD86NOp8hHHk
---

Now that I have my blog built on Angular with the help of [Scully](https://billjellesmacoding.netlify.app/blog/20201219_scully), my next step was that I wanted to try out using graphql to retrieve some of my data. I knew that graphql was an alternative to REST for retrieving data from a server. Fortunately, I found that Netlify offers you to get some server functionality with serverless functions. I then found out that you can run an apollo server using [AWS Lambda](https://www.apollographql.com/docs/apollo-server/deployment/netlify/)

## Server

1. `npm init -y`
2. `npm i apollo-server-lambda graphql netlify-lambda`

apollo-server-lambda and graphql will give you the functionality to create an apollo server and give you the ability to use graphql. netlify-lambda will give you the ability to serve this as if it was a netlify serverless function.

3. `npm i netlify-cli`
3. `touch netlify.toml`
4. Add the following to netlify.toml

```toml
[build]
    functions = "lambda"
```

this will compile all of your serverless functions to a folder called lambda

5. `mkdir functions && cd functions`

This is a directory that'll house all of your functions

6. `touch graphql.js` inside of your functions directory

7. Use the following code inside of `graphql.js`

```js
const { ApolloServer, gql } = require("apollo-server-lambda");

// Define the type definitions. Query is required
const typeDefs = gql`
  type Query {
    greeting: Greeting
  },
  type Greeting {
      friendly: String
  }
`;

// Define a greeting object that we will send to the client when they ask for it
const greeting = {
    friendly: 'Hello Bill'
  };

// Define a resolver so the greeting object is returned when greeting is queried for
const resolvers = {
  Query: {
    greeting: (root, args, context) => greeting
  }
};

// create an instance of an ApolloServer that will use the type definitions and resolvers
// also set the playground option to true so that we can use graphical when navigating to /graphql
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
});

// netlify lambda expects a handler to be exported
// also set the cors to * so that we can access these resources from anywhere
exports.handler = server.createHandler({
    cors: {
        origin: '*',
    }
})
```

8. Create the following scripts inside of `package.json`

```json
"scripts": {
    "lambda-serve": "netlify-lambda serve functions",
    "lambda-build": "netlify-lambda build functions"
  },
```

9. Run the apollo server with `npm run lambda-server`

Notice that a new lambda directory will be created with a minified version of our function

If we navigate to http://localhost:9000/graphql in our browser, we'll see the graphical playground. Graphical is useful because it gives us an easy way to query for the resources that we defined on the server without needing to build a client.

10. Use the following graphql in the left pane of graphical

```graphql
{
  greeting {
    friendly
  }
}
```

and on the right pane, we'll see the expected data of the friendly greeting

```graphql
{
  "data": {
    "greeting": {
      "friendly": "Hello Bill"
    }
  }
}
```
![Angular Material Table](../../assets/images/20210311_graphical.png)
