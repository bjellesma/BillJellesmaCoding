---
title: 'What Did I Do?'
date: '2019-11-15 19:00:00'
updateTime: '2019-11-15 19:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20191115_author_bjellesma.jpg'
tagline: 'Finding Referenced Assemblies for DLLs can be very important to know. I found out the hard way!'
tags:
- C#
- .Net
---

# The Setup

A couple of days ago, I found myself in a position where I uploaded some Dynamic Link Libraries (DLLs) compiled from C# classes to production. Cleverly (I thought), I created a centralized library that these DLLs would reference. This centralized library would contain methods I use frequently such as converting a Y or N into their equivalent boolean values. Because of the nature of DLLs, whenever I change the definition of a method in my library, I need to rebuild every C# class dependant on the library. My quick and dirty fix for this is to just have different versions of the library (1.0, 1.1, 1.2, etc.) that the C# classes can reference. The problem is that I forget the version of the library that I'm referencing whenever I make changes to the C# class. This means that when I make a new build of my library and put it in production, I'm not sure of what will break!

![Uh Oh](../../assets/images/20191115_author_bjellesma.jpg)

I wondered to myself if I'd be able to tell the version of my library being referenced from the DLL. It makes sense because you still need the library DLL as a seperate file even after the C# class is compiled. Is this actually possible? Is this reverse engineering? Will I go to jail? To my great elation, I found that this definetly is possible using the [reflections](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/reflection) library. 

Reflections is a library in C# that you can use to access the metadata of an assembly. Basically, I can use it to find any references that my DLLs are making. 

# What I did to solve finding what I did do

Tongue twisters aside, we can start out by creating a new console app in visual studio. If you're thinking that Visual Studio costs money, you can get the [community edition](https://visualstudio.microsoft.com/vs/community/) (free). We'll place all of our code inside of the main method. 

```cs
using System;

namespace Program
{
    class Program
    {
        static void Main(string[] args)
        {
            // You sign here
        }
    }
}
```

In order to use the reflections library, we'll need to include it with a using statement. We can add this at the top of the file next to the other using statement.

```cs
using System;
using System.Reflection; //this is new
```

We can simply use the reflections library and stick that metadata in a variable with `var`.

```cs
var assembly = System.Reflection.Assembly.ReflectionOnlyLoadFrom(fileName);
```

The [var keyword](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/var) allows the compiler to determine the variable type. Like Javascript, the var keyword can contain any type of variable and the compiler will throw an error if anything is amiss.

Great, we have all the metadata. Now, we want to know what the DLLs are referencing.

```cs
var referencedAssemblies = assembly.GetReferencedAssemblies();
```

This gives a lot of information that we don't need about the file. References to `mscorelib`, `system.data`, `microsoft.csharp`. We only need to know about our centralized library. We can easily just filter this:

```cs
if (assemblyName.ToString().Contains("<Library Name>"))
    {
    Console.Writeline($"found it! {assemblyName}")
    }
```

What makes this even easier is that we have all of the DLLs located in one directory. So, we can simply iterate over the entire directory. we can even filter the filenames so that only DLLs are found. What's more? We can write all of this to a file so that we don't have to try to read all of this information that scrolls by in the console.

```cs
string[] fileNames = Directory.GetFiles("<directory>", "*.dll");
using (System.IO.StreamWriter file = new System.IO.StreamWriter("references.text"))
{
    
    foreach (string fileName in fileNames)
    {
        try
        {
            var assembly = System.Reflection.Assembly.ReflectionOnlyLoadFrom(fileName);
            var referencedAssemblies = assembly.GetReferencedAssemblies();

            foreach (var assemblyName in referencedAssemblies)
            {
                if (assemblyName.ToString().Contains("<Library Name>"))
                {
                    file.Writeline($"found it! {assemblyName}")
                }

            }
        }
        catch (System.IO.FileLoadException ex)
        {
            file.WriteLine($"Unable to parse ${fileName}. Error: ${ex.Message}");
        }
        
    }
}
```

Lastly, notice that we've included a try catch statement to catch any errors if we're unable to load the assembly information. Because of the nature of DLLs, the file could be locked by another program trying to use it.

The full program is here:

```cs
using System;
using System.Reflection; 

namespace Program
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] fileNames = Directory.GetFiles("<directory>", "*.dll");
            using (System.IO.StreamWriter file = new System.IO.StreamWriter("references.text"))
            {
                
                foreach (string fileName in fileNames)
                {
                    try
                    {
                        var assembly = System.Reflection.Assembly.ReflectionOnlyLoadFrom(fileName);
                        var referencedAssemblies = assembly.GetReferencedAssemblies();

                        foreach (var assemblyName in referencedAssemblies)
                        {
                            if (assemblyName.ToString().Contains("<Library Name>"))
                            {
                                file.Writeline($"found it! {assemblyName}")
                            }

                        }
                    }
                    catch (System.IO.FileLoadException ex)
                    {
                        file.WriteLine($"Unable to parse ${fileName}. Error: ${ex.Message}");
                    }
                }
            }
        }
    }
}
```

# Done!

![Done](https://chumley.barstoolsports.com/wp-content/uploads/2019/09/03/giphy.gif)

Sweet! Build the program by pressing F6 in Visual Studio or go to run -> build. This compiles into an exe in the obj/debug directory. Copy this EXE into any folder containing some DLLs and double click the file. Within seconds, we should see a `references.txt` file listing the DLL name followed by a list of filtered references. If you want to get all references and not just a filtered list, simply remove the `if` statement.

```cs
if (assemblyName.ToString().Contains("<Library Name>"))
{
    file.Writeline($"found it! {assemblyName}")
}
```

And replace this with

```cs
file.Writeline($"found it! {assemblyName}")
```

# References

* [https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/reflection](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/reflection)
* [https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/var](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/var)