---
title: 'Using TryGetValue in C# to get Dictionary Values'
date: '2019-12-20 01:00:00'
updateTime: '2019-12-20 01:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20191220_c_try_catch.png'
tagline: 'Concise Code leads to maintainable Code'
tags:
- C#
- .Net
---

# TL;DR

- `Dictionary.TryGetValue` leads to more concise code when used with a ternary operator.
- There is a tradeoff between concise code and readable code. In this case, you gain a lot in concise code and lose only a little in readability.

# The whole Shebang

Have you ever tried to retrieve values from C# Dictionaries using a big try catch statement? I usually store a lot of information in my dictionaries such as settings that I pass in through xml so my code used to look like the following 

```cs
try
{
    var1 = settings["var1"];
    var2 = settings["var2"];
    var3 = settings["var3"];
}
catch (Exception ex)
{
    Console.WriteLine($"Not all settings were received. Error: {ex.Message}.");
}
```

The problem with the above code is that if my XML file were missing entries for any of var1, var2, or var3, I would receive the following error

```
given key was not present in the dictionary
```

Not very helpful. It'd be great to know if var1, var2, or var3 is missing. One way would be to separate the code into multiple try catch statements like the following:

```cs
try
{
    var1 = settings["var1"];
}
catch (Exception ex)
{
    Console.WriteLine($"var1 is missing.");
}

try
{
    var2 = settings["var2"];
}
catch (Exception ex)
{
    Console.WriteLine($"var2 is missing.");
}

try
{
    var3 = settings["var3"];
}
catch (Exception ex)
{
    Console.WriteLine($"var3 is missing.");
}
```

This solves the issue but adds a lot to our code. What if we had 20 different settings to grab from the dictionary? The solution quickly becomes messy and violates DRY (Don't Repeat Yourself). 

Is there a possible one liner that we can use, similar to how we can use `.get` to attempt to get the value from a dictionary in python? I'm glad you asked because there most certainly has been a solution since [.NET 2.0](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2.trygetvalue?view=netframework-2.0). [`TryGetValue`](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2.trygetvalue?view=netframework-4.8) will return true or false depending on whether or not the specified key is in the dictionary. We can then use a [ternary operator in C#](https://www.tutorialspoint.com/Ternary-Operator-in-Chash) to either return the value from the dictionary or raise an exception. The following is the line to get var1 from the dictionary.

```cs
string outvar = null;
var1 = settings.TryGetValue("var1", out outvar) ? outvar : throw new Exception("var1 is missing");
```

This one compact line may be a little strange at first glance so a little explanation is needed. 

1. `TryGetValue` will act as a method on the dictionary settings and return true or false based on whether or not var1 is in settings.
2. The use of `out` with outvar is a [parameter modifier](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/out-parameter-modifier). If var1 is found in settings, the value for var1 is passed to outvar. If the key is not found, outvar will simply remain null.
3. If `TryGetValue` evaluates to true (var1 is found in the dictionary), the statement after the ? executes and var1 is set to outvar which will be the value of the var1 entry in the dictionary.
4. If `TryGetValue` evaluates to false (var1 is not found), the statement after the : is executed and an exception is raised that var1 is missing

Great! This is exactly what we want. Because `outvar` is being used as a temporary variable, we can reuse this for all of the ternary operators.

```cs
string outvar = null;
//var1 is set to the value of var1 entry in settings if var1 is in the Dictionary, else an exception is raised
var1 = settings.TryGetValue("var1", out outvar) ? outvar : throw new Exception("var1 is missing");
var2 = settings.TryGetValue("var2", out outvar) ? outvar : throw new Exception("var2 is missing");
var3 = settings.TryGetValue("var3", out outvar) ? outvar : throw new Exception("var3 is missing");
```

Notice that I've made a comment to helpful out other developers (any myself after a long weekend).

Although this can be a little more complicated to understand at first glance, the tradeoff that you get from the concise code may be more than worth it. I really like the concise nature of these ternary operators.