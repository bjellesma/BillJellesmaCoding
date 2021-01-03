---
title: 'Python Type Checking With Voluptuous'
date: '2020-02-26 23:15:00'
updateTime: '2020-09-15 23:15:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20200226_voluptuous.jpg'
tagline: 'Voluptuous code is phat'
tags:
- Python
---

# Edits

* September 15, 2020 [API Validation with Voluptuous](#api-validation)

# Intro

Python dictionaries are great! They create a simple yet powerful data structure, they're easy to reference in code, and they provide an easy way to pass data to a function. Python dictionaries might be my best friends when my so called real friends are off getting married and starting families. I especially love using them to pass several parameters to a function so instead of:

```py
def hows_my_driving(name, arrests, outstanding_tickets, driving_status):
```

you can write

```py
def hows_my_driving(user_stats):
```

and just expect a dictionary with the right values. However, this assumes that you're always going to be passed a dictionary of what you expect. While you can simply use `user_stats.get("name")` which should either get the value in the dictionary, if found, or give `None`, I decided to do some googling around and found a faster, more formal way to declare what you want. I found a package called `Voluptuous` which allows to create a schema that you can use to validate your dictionary against.

# Quick Use

A quick and easy use of Voluptuous is to ensure that all values have the correct types that we want. Suppose that we use the function def above `def hows_my_driving(user_stats):`, we can verify this dictionary with a schema from Voluptuous:

```py
from voluptuous import Schema

user_schema = Schema({
    'name': str,
    'arrests': int,
    'outstanding_tickets': int,
    'driving_status': str
})
```

So we're saying that the keys `name` and `driving_status` MUST be strings while `arrests` and `outstanding_tickets` MUST be integers. If the schema is violated, Voluptuous raises an exception of the key and the expected type. Using a try-catch statement, this is how we can validate the dictionary:

```py
try:
    user_stats = user_schema(user_stats)
except Exception as err:
    raise Exception(f'The user_stats dictionary was not formatted correctly. Error: {err}')
```

If we pass in a valid dictionary such as

```py
user_stats = {
    'name': 'Bill',
    'arrests': 0,
    'outstanding_tickets': 0,
    'driving_status': 'OK'
}
```

then we'll pass the try statement without error and proceed to the next line
```py
print(f'{user_stats["name"]} is {user_stats["driving_status"]}')
```

 But if we pass in a dictionary where the key `arrests` is formatted as a string such as below

```py
user_stats = {
    'name': 'Bill',
    'arrests': '0',
    'outstanding_tickets': 0,
    'driving_status': 'OK'
}
```

then an exception will be raised and stop the program's execution with
```
The user_stats dictionary was not formatted correctly. Error: expected int for dictionary value @ data['arrests']
``` 

Of course, you can choose to handle this logic differently and not raise an exception to continue the program's execution.

# Required keys

What if the method or user calling our method forgets a key? The keys are optional in the schema above by default so we can pass

```py
user_stats = {
    'arrests': 0,
    'outstanding_tickets': 0,
    'driving_status': 'OK'
}
```

which will pass the schema but lead to an unhandled exception later on we attempt to print the results with 

```
KeyError: 'name'
```

`name` and `driving_status` are going to be required for the print statement to not error out. Luckily, voluptuous can handle this with

```py
from voluptuous import Schema, Required

user_schema = Schema({
    Required('name'): str,
    'arrests': int,
    'outstanding_tickets': int,
    Required('driving_status'): str
})
```

We'll also want to rework our exception handling slightly with

```py
from voluptuous import MultipleInvalid

try:
    user_stats = user_schema(user_stats)
except MultipleInvalid as err:
    raise Exception(f'The user_stats dictionary was not formatted correctly. Error: {err}')
```

Now, we're back to our handled exception with

```
Exception: The user_stats dictionary was not formatted correctly. Error: required key not provided @ data['name']
```

Taking this further, we may have a longer dictionary where we want to require all of the keys. Instead of explicitly making each key required, we can pass `required=true` to the Schema object.

```py
from voluptuous import Schema

user_schema = Schema({
    'name': str,
    'arrests': int,
    'outstanding_tickets': int,
    'driving_status': str
}, required=True)
```

And we can go the other way and explicitly write some keys as optional:

```py
from voluptuous import Schema, Optional

user_schema = Schema({
    'name': str,
    Optional('arrests'): int,
    'outstanding_tickets': int,
    'driving_status': str
}, required=True)
```

# Length

We can take this a little further and say that there should be no more than 5 arrests:

```py
from voluptuous import Schema, Required, Range, All

user_schema = Schema({
    Required('name'): str,
    'arrests': All(int, Range(min=0, max=5)),
    'outstanding_tickets': int,
    Required('driving_status'): str
})
```

_Notice that we want to use `All` to combine multiple requirements to the same field_

So if we pass the following dictionary

```py
user_stats = {
    'name': 'Bill'
    'arrests': 6,
    'outstanding_tickets': 0,
    'driving_status': 'OK'
}
```

We will receive

```
The user_stats dictionary was not formatted correctly. Error: value must be at most 5 for dictionary value @ data['arrests']
```

# Urls


Now, let's say that we want to have a url in our dictionary we can give to the program. Voluptuous has a solution for that

```py
from voluptuous import Url

user_schema = Schema({
    Required('name'): str,
    'arrests': All(int, Range(min=0, max=5)),
    'outstanding_tickets': int,
    Required('driving_status'): str,
    Required('url'): Url()
})
```

Notice that we've been using types for the dictionary value. Here, we're using a callable to validate the `url` key. The `url` key needs to be a string which is a valid url. In the schema validation, we can use this

```py
user_stats = {
    'name': 'Bill',
    'arrests': 0,
    'outstanding_tickets': 0,
    'driving_status': 'OK',
    'url': 'https://billjellesmacoding.netlify.com/'
}
```

but not this

```py
user_stats = {
    'name': 'Bill',
    'arrests': 0,
    'outstanding_tickets': 0,
    'driving_status': 'OK',
    'url': '://billjellesmacoding.netlify.com/'
}
```

# Custom Validation Functions

Let's say that you want all users to enter a Date of birth and you'd like these dates to all be entered in the correct format. You can use a custom validation method to ensure that the date is in the format that you want.

```py
from voluptuous import Schema, Range, All, Url, Optional

user_schema = Schema({
    'name': str,
    'arrests': All(int, Range(min=0, max=5)),
    'outstanding_tickets': int,
    'driving_status': str,
    Optional('url'): Url(),
    Optional('dob'): Date()
}, required = True)
```

Date of birth is going to be validated against our custom `Date()` method

```py
from datetime import datetime

def Date(fmt='%m/%d/%Y'):
    # lambda functions are a quick way to make a one line anonymous function
    # this lambda attempts to parse the date against the given format
   return lambda v: datetime.strptime(v, fmt)
```

```py
user_stats = {
    'name': 'Bill',
    'arrests': 0,
    'outstanding_tickets': 0,
    'driving_status': 'OK',
    'url': 'https://billjellesmacoding.netlify.com/',
    'dob': '02/26/2020'
}
```

# <a name="api-validation">API Validation with Voluptuous</a>

Recently, I've been working on a [Udacity Nanodegree](https://www.udacity.com/nanodegree) and I decided to use Voluptuous to validate my API requests. I wanted to have an easy reusable function to validate that the expected JSON data is sent with a POST, PUT, or PATCH request. What better way than to basically validate against a dictionary?

When I first started learning how to validate forms, the idea that I learned was to start with an array of errors and then append to that array whenever data wasn't in the correct form. I still use this method of validation today! So, this will be the general idea for validating the data that our users pass to create a user object.

```py
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    api_errors = []
    if 'username' in data:
        username = data.get('username')
    else:
        api_errors.append('Username is required to be passed in the JSON data')
    # Check if any errors 
    if api_errors:
        # If any errors were found, return a 400 with a status code
        return jsonify({
            'message': 'An error has occurred',
            'status_code': 400,
            'errors': api_errors
        })
    # If the errors array is still empty
    else:
        # insert user and pass successful response
        user = UsersModel.create_user(
            username=username
        )
        return jsonify({
            'message': 'The API request was successful',
            'status_code': 200,
            'user': user
        })
```

The above code is fine if you have you only a few parameters. Let's say that in addition to username, we'll also want the email. Unlike username, the email of the user isn't required and will just store `'Not Provided'` if not passed. Also, we need to verify that the username is a string and the email, if passed, is a string.

```py
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    api_errors = []
    if 'username' in data:
        username = data.get('username')
    else:
        api_errors.append('username is required to be passed in the JSON data)
    # check to make sure that the username is sent as a string
    if not isinstance(username, str):
        api_errors.append('username was not sent as a string')
    # get type and make sure that it is a string
    email = data.get('email')
    # We won't throw an error if email is not defined but we will only validate
    # the email if it has been passed
    if email and not isinstance(email, str):
        api_errors.append('email was not sent as a string')
    else:
        email = 'Not Provided'
    if api_errors:
        # If any errors were found, return a 400 with a status code
        return jsonify({
            'message': 'An error has occurred',
            'status_code': 400,
            'errors': errors
        })
    else:
        # insert user and pass successful response
        user = UsersModel.create_user(
            username=username,
            email=email
        )
        return jsonify({
            'message': 'The API request was successful',
            'status_code': 200,
            'users': user
        })
```

Quickly, our code is becoming harder to manage and you want to be able to keep it consistent. You want a quick and easy way to make the code consistent so that another developer, or even yourself after not touching the code for awhile, can easily build on the code. Naturally, we want to create a function so that our document can tell other developers, and future you, how to work with the code. Here's where using a data validation package like Voluptuous comes in handy.

To start, what we can do is to define a scheme at the top of the module file:

```py
from voluptuous import Schema, Required, Optional

user_schema = Schema({
    Required('username'): str,
    Optional('emal'): str
})
```

Now instead of checking the errors directly inside of the API definition, we will call another function to generate our error. This makes it easy to tell future developers to just call a function.

```py
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    # make this one function call to generate any errors
    api_errors = validate_against_api(
        data=data, schema=user_schema, request=request
    )
    if api_errors:
        return jsonify({
            'message': 'An error has occurred',
            'status_code': 400,
            'errors': api_errors
        })
    username = data["username"]
    email = data["email"]
    user = UsersModel.create_user(
        username=username,
        email=email
    )
    return jsonify({
        'message': 'The API request was successful',
        'status_code': 200,
        'users': user
    })
    
```

We're using a new function, `validate_against_api` that will validate the request and return any errors. This takes the place of us checking all parameters and types manually.

```py
def validate_against_api(data, schema, request, optional=False):
    """Validate data sent to an api endpoint

    Args:
        data (object): decoded json object sent to the endpoint
        schema (object): voluptous schema object.
        request (object): flask request object to make calls on

    Returns:
        string list: list of string error messages to send back to the
        endpoint to handle.
    """
    # 1
    api_errors = []
    # 2
    try:
        data = schema(data)
    # 3
    except DictInvalid as error:
        api_errors.append(
            f'''Data not understood. Did you sent request parameters
            instead of a JSON body?''')
    # 4
    except Exception as errors:
        for err in errors.errors:
            # 5
            if err.msg == "required key not provided":
                api_errors.append(
                        f'''{err.path[0]} was required and not provided for
                        call to {request.path} as {request.method}.
                        Please consult the documentation for this
                        endpoint.''')
            # 6
            elif 'expected' in err.msg:
                api_errors.append(
                    f'''{err.path[0]} was in the incorrect format for call
                    to {request.path} as {request.method}. Please
                    consult the documentation for this endpoint.''')
    return api_errors
```

So,

1. We're create an `api_errors` list, which we'll return at the end of the function to pass any errors back to the API definition
2. We're using a series of try except statements and using voluptuous to validate the schema, as we've done before.
3. The first error to catch is a `DictInvalid` error, which I find usually occurs when my data object is empty. I used to send data as form data to my API before learning that sending the data as a JSON body is easier to parse and debug. Still, old habits die hard and I've done this once or twice where I send data as form data by mistake.
4. I set the general `Exception` class as the next error to catch because I'll always want to iterate over the `errors.errors` object. It is `errors.errors` because a general errors object is sent and then an errors attribute is sent with the object because more than one error may be thrown.
5. We can now check the message that was sent with each error. If a `"required key not provided"` is the message, then a required attribute on the schema was violated. We can use the `path` attribute of the error to get the name of the required parameter that was violated. We can also use the `path` and `method` attributes on the request object to pull more information that may be useful to an API consumer. 
6. Similarly, if the word `expected` is found in the message, we can tell that the violation was an incorrect type.

Now we have a reusable function that we can use to validate our API requests. This will help to keep the code consistent so that developers aren't using their own code to validate.

## One Caveat for PATCH

However, there is one difference with PATCH requests. Because PATCH requests conventionally are used so that the user can update only a single attribute of an object, we update the above validate function slightly,

```py
def validate_against_api(data, schema, request, optional=False):
    """Validate data sent to an api endpoint

    Args:
        data (object): decoded json object sent to the endpoint
        schema (object): voluptous schema object.
        Project available at https://github.com/alecthomas/voluptuous
        request (object): flask request object to make calls on
        optional (bool): if optional flag is set. requirement errors
        will be passed over.
            This is mostly to deal with PATCH methods so that the user can
            update only one field

    Returns:
        string list: list of string error messages to send back to the
        endpoint to handle.
    """
    api_errors = []
    try:
        data = schema(data)
    except DictInvalid as error:
        api_errors.append(
            f'''Data not understood. Did you sent request parameters
            instead of a JSON body?''')
    except Exception as errors:
        for err in errors.errors:
            if err.msg == "required key not provided":
            # Where optional is used
                if not optional:
                    api_errors.append(
                        f'''{err.path[0]} was required and not provided for
                        call to {request.path} as {request.method}.
                        Please consult the documentation for this
                        endpoint.''')
            elif 'expected' in err.msg:
                api_errors.append(
                    f'''{err.path[0]} was in the incorrect format for call
                    to {request.path} as {request.method}. Please
                    consult the documentation for this endpoint.''')
    return api_errors
```

We're passing an additional `optional` boolean parameter so that we can later not generate an error if a required parameter is not passed by setting this to True. Again, PATCH requests are recognized as a partial update so that we're not updating the entire object. This optional parameter helps us to make the required constraint a little bit more "loose".

In our main API definition, we'll also update our call slightly so that we use `data.get()` to get the parameter if it's defined and return `None` if not defined. We'll also set optional as True when we call our validate function.

```py
@app.route('/api/users/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    """Update a user in a database

    Args:
        user_id (int): id of the user to be updated
    """
    data = request.get_json()
    api_errors = []
    # Validate json sent
    api_errors = validate_against_api(
        data=data,
        schema=user_schema,
        request=request,
        optional=True)
    # if there are errors, abort with a 400
    if api_errors:
        return jsonify({
            'message': 'An error has occurred',
            'status_code': 400,
            'errors': api_errors
        })

    user = UsersModel.update_user({
        "id": user,
        "username": data.get("username"),
        "email": data.get("email")
    })
    return jsonify({
        "message": "success",
        "status_code": 200,
        "user": user
    })
```

Now, our `validate_against_api()` function is just a little bit more universal and can deal with more requests. 

# Outro

The above are just a few features of Voluptuous that I've found to be useful but here is the Github repo which has even more examples of functionality: [https://github.com/alecthomas/voluptuous](https://github.com/alecthomas/voluptuous)

Type checking is an important thing that statically typed languages have always had over "hobbiest" languages. Even though a lot of the burden has always fallen to the programmer to type check their code, packages like this as well as the growing popularity of TypeScript have really helped in this area to ease the burden.