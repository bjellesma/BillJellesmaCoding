---
title: "Botpals - Flask restful and flask cors"
date: "2024-04-12 23:00:00"
updateTime: "2024-04-12 23:00:00"
author: "Bill Jellesma"
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20240412_flask-restful.png
tagline: "Flask makes it easy to setup a quick restful api"
published: True
tags:
  - Flask
  - API
  - Python
  - Pipenv
---

As I'm developing more on [Botpals](https://github.com/bjellesma/Botpals), I'm getting to the point where I want to create a backend to my project so I can properly serve data to my React frontend through API calls. I wanted something that I can scale up so I decided to use [Flask](https://flask.palletsprojects.com/en/3.0.x/), a python microframework that makes it very easy to setup an API. [Flask-Restful](https://flask-restful.readthedocs.io/en/latest/) is a package built on top of flask that makes it even easier and faster to develop a RESTful API by simply creating classes and methods.

Nodepals already has a directory called `public` which contains all of my frontend pages and react components so I made a new directory called `server` at the root of my app. As I like to do with other python projects, I setup a pipenv virtual environment so that my packages are separate from my regular python environment. If you don't have pipenv installed, you can use

```bash
python -m pip install pipenv
```

If you're using Mac or Linux, you'll likely have your main python command as python3

```bash
python3 -m pip install pipenv
```

If you're using a newer version of Ubuntu Linux, you may even have to install a package

```bash
sudo apt-get install pipenv
```

From here, I'll usually use the following command to initialize a virtual environment

```bash
pipenv shell
```

You should now see a `Pipfile` inside of the directory where you initialized the virtual environment. In my case, the path of my file is `server/Pipfile`. Now we can start adding packages with pipenv.

```bash
pipenv install flask
pipenv install flask-cors
pipenv install flask-restful
```

By installing these packages, you'll now have a `Pipfile.lock` file in the same directory.

What I like to do with pipenv is to take advantage of create custom script commands by specifying them in the file. You can make a seperate `[scripts]` section like so

`Pipfile`
```python
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
flask = "*"
flask-cors = "*"
flask-restful = "*"

[dev-packages]

[requires]
python_version = "3.10"

[scripts]
"server" = "python3 app.py"

```

By adding the `[scripts]` section, I've made it so that I can do `pipenv run server` to run `app.py` in an environment with the above packages installed.

With the environment setup, the first thing to do is create the `app.py` file

`server/app.py`
```python
from flask import Flask
app = Flask(__name__)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

This is the easiest way to start your app. I like to pass a few params into `app.run`. Particularly, `debug=True` will make it so that the app will automatically restart if it notices a python change. This speeds up development a lot and is a huge quality of life feature. More time to go get coffee :)

We'll first create a file which simply contains a list of the bots that we want to use. This acts as our database. In addition, we'll create a class called `BotsList` that extends the `Resource` class from `flask-restful`. This class will have just two methods called `get` which simply returns the list of bots and `post` which is slightly more complex. `post` will find the last id in the array and append a new dictionary with the body of the request that you've entered. By convention, methods are named the same as the REST verbs (get, post, patch, put, delete, etc.)

`bots.py`
```python
from flask_restful import Resource
bots = [
    {
        "id": 1,
        "name": "Claudette",
                "tagline": "Claudette uses the API of claude.ai to help",
                "fullDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "location": "Boston, MA"
    },
    {
        "id": 2,
        "name": "Chatty",
                "location": "Miami, FL",
                "tagline": "Chaty uses the API of ChatGPT to help.",
                "fullDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "company": {
                    "name": "Veneer Solutions",
                    "description": "Veneer Solutions is a creative agency specializing in digital design and development. Our team is dedicated to pushing the boundaries of creativity and innovation to deliver exceptional results for our clients.",
                    "contactEmail": "contact@loremipsum.com",
                    "contactPhone": "555-555-5555"
                }
    },
    {
        "id": 3,
        "name": "Bill",
                "tagline": "Bill is just a standard human masquerading as a bot. He's a little tempermental at times",
                "fullDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "location": "Boston, MA"
    },
    {
        "id": 4,
        "name": "Henry",
                "tagline": "Henry is an extra bot not normally shown",
                "fullDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "location": "Boston, MA"
    }
]

# By convention, the functions are named the same as the REST verbs
class BotList(Resource):
    def get(self):
        return bots

    def post(self):
        data = request.json
        last_bot_id = bots[-1].get("id")
        new_bot = {"id": last_bot_id+1, **data}
        bots.append(new_bot)

        return new_bot
```

Before creating any routes, I like to take advantage of a feature in Flask called Blueprints. Blueprints will allow you to seperate your routes into different files and generally keep your app code more organized. I'll make a new directory called `routes` to hold all of my routes and, just to keep my api routes seperate in case I decide to create non-api routes in the future, make a subdirectory called `api`. Inside of the `api` directory, I'll make a file called `bots.py`.

## Short tangent on CORS (not the beer which is spelled differently)

Before making the Blueprint, you may have noticed I slipped `flask-cors` into the package management earlier. This is because modern browsers will disallow requests coming from different domain and port combinations. This is a security feature that prevent Cross-site request forgery (CSRF) attacks which were prevalent in the early days of browser. So it's good that modern browsers have this but will also cause us to run into an error on the browser if we try to query `localhost:5000` from `localhost:3001`, the port that our react application runs on.

![CORS error](../../assets/images/20240412_cors.png)

So we'll need to take advantage of a mechanism called Cross-origin resource sharing (CORS) which is an extension of the policy preventing CSRF attacks. Flask is able to do this with a package called `flask-cors`. Once we import `CORS` from the package, we can use the `CORS` object on our server to allow requests from other origins. In our case, we'll want to allow port 3001 from localhost. Note that this is for development and production environments should be more restrictive so consider making an enviromental variable in the future. 

## tangent over 

We can use the `Blueprint` class from flask to name our routes related to routes as `bot_routes`. Additionally, we can use a param called `url_prefix` on the object to prepend it to any route using that blueprint. In our case, all routes of that form will be `/api/{resource}` so we might as well prepend to save us some typing.

We'll use a class from `flask-restful` called `Api` which will take the blueprint object that we've created to create the api object.

Finally, we'll use a method of the `Api` class called `add_resource` to take the `BotList` class that we make earlier.

`server/routes/api/bots.py`
```python
from flask import Blueprint
from flask_cors import CORS # if you listened to my tangent, you'd know
from flask_restful import Api

from bots import BotList
# url prefix will begin all routes so that we don't need to keep typing it
bot_routes = Blueprint('bot_routes', __name__, url_prefix="/api")
CORS(bot_routes, origins=["http://localhost:3001"])  # Apply CORS to the bot_routes blueprint
api = Api(bot_routes, errors=bot_routes.errorhandler)

api.add_resource(BotList, "/bots")
```

That's it, we can now query `localhost:5000/api/bots` and get the list of bots. Here we're using [Postman](https://www.postman.com/) as a quick tool to query our api

![Get all bots](../../assets/images/20240412_get_bots.png)

We can also test our post method by changing the http verb of the request to POST and passing in a dictionary with just the name of the new bot

![Create Bot](../../assets/images/20240412_create_bot.png)

But the beauty of `Flask-Restful` comes from querying and performing actions on a single resource. For this, we'll go back to `bots.py` and create a new class for single resource actions.

First we'll make an import from `Flask` in order to get `request` which is an object that will hold any http request data and `abort` which will simply return a 404 json error if a resource can't be found

`bots.py`
```python
from flask import request, abort
```

Now we'll add the class which will handle a single resource. By convention, this class naming is similar to the List class we made earlier by will use Resource instead.

Notice that we still have a get method to get a single resource but we also have methods for put and delete corresponding to their respective REST verbs. The `get` method will use a filter to find the bot from our list and return `None` if it can't be found as a signal to return our 404 error. The `put` and `delete` methods are similar as they will iterate the list of bots to find what we're looking for as well as append a new dictionary in the case of `put` and remove the bot dictionary from the list in the case of `delete`.

`bots.py`
```python
class BotResource(Resource):
    def get(self, bot_id):
        # filter returns a function iterator object so next() is used to get the next value of the iterator, a dict in this case
        # The second param in the next() function is a default value so that a stop iteration isn't hit
        bot = next(filter(lambda bot: bot.get("id") == bot_id, bots), None)

        if not bot:
            abort(404)

        return bot
    
    # for a put REST command, the dict with the data you'd like to change has to be in the body of the request
    def put(self, bot_id):
        data = request.json

        bot = None 
        # iterate the bot list and track the index
        for index, b in enumerate(bots):
            if b.get("id") == bot_id:
                # create a new dictionary with the original data of the bot and the new data
                bots[index] = {**b, **data}
                bot = bots[index]
        # if no bot is found to update, throw a 404
        if not bot:
            abort(404)

        return {"message": "bot updated", "bot": bot}
    
    def delete(self, bot_id):
        bot = None 

        for index, b in enumerate(bots):
            if b.get("id") == bot_id:
                bot = b 
                bots.pop(index)

        if not bot:
            abort(404)

        return {"message": "bot deleted", "bot": bot}

```

Back on our route, we want to import this new class in addition to the `BotList` class.

`server/routes/api/bots.py`
```python
from bots import BotList, BotResource
```

Beneath where we've added the resource for `BotList`, we'll add a new resource for `BotResource`. We'll also append to the `/bots` url with a `Flask` feature to add variables to the url. In this case, we add a variable to the url that accepts an integer. This integer will be passed to all methods of the `BotResource` class as a parameter called `bot_id` (remember above that these were added above).

`server/routes/api/bots.py`
```python
api.add_resource(BotList, "/bots")
api.add_resource(BotResource, "/bots/<int:bot_id>")
```

Once all this is added and the server is restarted, you can now enter this three new endpoints into postman to test these routes. Make sure to change the verbs for doing the put and delete requests. The put request will also requiring adding the update dictionary to the body of the request.

![Get single bot](../../assets/images/20240412_get_bot.png)

![Update bot](../../assets/images/20240412_update_bot.png)

![Delete bot](../../assets/images/20240412_delete_bot.png)

## Conclusion

Regular `Flask` is still a great resource for creating APIs and may allow you a little more control as your routes are more explicit with decorators but `Flask-restful` was originally designed by Twilio and makes the process of creating a RESTful API cleaner and faster. Going forward, I imagine sticking with this package. This blog posting was based on a [late 2023 video from Demos Petsas](https://www.youtube.com/watch?v=r6UesWGgYS4&list=PLSLBozfq-zZfEC7jDJcj0gjW5zR8jN75p&index=1)