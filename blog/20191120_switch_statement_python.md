---
title: 'Using a Switch Statement in Python has Switched'
date: '2019-11-20 19:00:00'
updateTime: '2020-02-06 19:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20191120_bjellesma_switch.jpg'
tags:
- Python 
---

# Edit - February 6, 2020

When I originally wrote this post a couple of months ago, I didn't realize a pretty useful case for the ternary operator. Take this function for example:

```python
def what_is_my_mood(mood_level):
    current_mood = (
        'Happy' if mood_level == 1 else 
        'Sad' if mood_level == 2 else 
        'Ambivalent'
    )
    return current_mood
```

`what_is_my_mood` is simply taking an integer value and then we're using a series of ternary operators (parentheses tell Python that these statements are part of one codeblock) to determine the string value assigned to `current_mood`. We're using the else clause at the end of each ternary operator to say that if `mood_level` isn't found yet, proceed to the next statement. The final string `Ambivalent` acts as our default case so that if `mood_level` isn't found in any statements, just assign `Ambivalent` to `current_mood`. The following are a few examples of what calls would yield:

```py
print(what_is_my_mood(1)) 
Happy
print(what_is_my_mood(2)) 
Sad
print(what_is_my_mood(3)) 
Ambivalent
print(what_is_my_mood(999))
Ambivalent 
```

One use case for this is if you want to make a function take an integer rather than some easy to forget string. Let's say that you're adding debug logs to a program and you want a different string error_type based on the severity. In my opinion, it's easier for the user of the program to remember that 1 outputs a debug log, rather than hoping the user remembers the string `Debug` and not `debug` or `dbug`.

# Intro

It's easy to fall in love with the simplistic yet beautiful syntax of Python. The ease of use, high extensibility and sheer power of Python make it the [2nd most popular programming language in 2019](https://hackernoon.com/8-top-programming-languages-frameworks-of-2019-2f08d2d21a1) according to Hackernoon. Personally, Python is often my go-to programming language for side projects.

One feature of the language, or lack of feature, in the language that I've always had an issue with is a `switch` statement. I also work a lot in C# so, whenever I'm faced with the idea of creating a bunch of `if` statements, I stop to think that I can simply write a `switch` statement to test the value of the variable. 

Instead of writing the following `if` statements in C#:

```cs
if(variable == "jeff"){
    Console.WriteLine("Hi Jeff")
}
else if(variable == "danny"){
    Console.WriteLine("Hi Danny")
}
else if(variable == "nick"){
    Console.WriteLine("Hi Nick")
}
else{
    Console.WriteLine("Hey you")
}
```

We can write the equivalent using a `switch` statement

```cs
switch(variable){
    case "jeff":
        Console.WriteLine("Hi Jeff")
        break;
    case "danny":
        Console.WriteLine("Hi Danny")
        break;
    case "nick":
        Console.WriteLine("Hi Nick")
        break;
    default:
        Console.WriteLine("Hey You")
}
```

Besides being neater code, it's much more maintainable and [performs slightly faster](https://www.geeksforgeeks.org/switch-vs-else/). If you have several if and else if cases like the example above, a `switch` statement is much faster because it can "jump" to the proper case rather than going through every if case. That being said, if you have only a couple of cases, then you won't see much of a difference in performance.

Unfortunately, there's no official `switch` statement in Python; this isn't a defect of the language. As most Pythonistas will tell you about everything, there is a more Pythonic way to do things. We just need to be a little creative.

## Think outside the Box

### Ternary Operators

Using if statements isn't always my favorite because of the lack of both readability and maintainability, but Python has improved on the idea of `ternary` statements to make them concise and readable at the same time. Ternary operators are really just beautified if statements. If statements for people in a hurry if you will.

Here's a ternary statement in C#:

```cs
Console.WriteLine("You can dance") ? variable=="you want to" : Console.WriteLine("You can leave your friends behind");
```

That's pretty non-intuitive to a beginner if you ask me. What's the question mark and what's the colon? I'm probably not the only programmer that has had to google "ternary operator c#" to figure out what's what. 

Now, compare the above to a simple python ternary operator.

```python
#here's a simple if statement
print("You can dance") if variable=="you want to" else print("You can leave your friends behind")
```

That's way more concise than a regular if statement and just as readable.

```python
if variable=="you want to":
    print("You can dance")
else:
    print("You can leave your friends behind")
```

### Dictionary Lookups

Python makes the concept of dictionaries very simple to implement. One pythonic trick with dictionaries is to utilize them as lookup tables

```python
hello_dict = {
    "jeff": "Jeff",
    "danny": "Danny",
    "nick": "Nick"
}
```

Now, you can reference the person to say hello to by using

```python
print('Hi {}'.format(hello_dict["nick"]))
```

But what happens if we want to say hi to someone not in the dictionary, namely Sam? We can't just leave Sam out. In the C# `switch` statement, this would be the default case that our logic falls through. In Python, we can use the `get` method to get our dictionary key. This way, if the key isn't in our dictionary, we can simply return a `None` (same idea as `Null` in most other languages). Better yet, we can pass in a second argument to return what we want in the default case.

```python
print('Hi {}'.format(hello_dict.get("sam", "you")))
```

The cool thing about this dictionary is that we can use this dictionary lookup technique to call a function. 

```python
def say_hi(fellow):
    phrase = "I'm in a function {}".format(fellow)
    return phrase

hello_dict = {
    "jeff": say_hi("Jeff"),
    "danny": say_hi("Danny"),
    "nick": say_hi("Nick")
}

print('Hi {}'.format(hello_dict.get("nick", "you")))
```

This is a simple example but it illustrates the fact that we create entire code blocks inside of our dictionary lookup.

## Conclusion

Personally, I will use both the ternary operators and dictionary lookup because they have different use cases in my mind. Remembering that readability is important for other developers as well as for yourself after a long weekend, I'll use the ternary operator for simple assignments. For example, if I'm building out an API, I'll use ternary operators to get my form data.

```python
username = request.form.get("username") if "username" in request.form else "Invalid user"
```

If I have either multiple cases or long code blocks, I'll use a dictionary lookup. An example of this would be if I'm using an API that gives me a zero indexed month and I need the corresponding full name of the month.

```python
months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    ...
    11: "December"
}
```