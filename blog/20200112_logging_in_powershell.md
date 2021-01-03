---
title: 'Keeping Logs in Powershell'
date: '2020-01-12 14:00:00'
updateTime: '2020-01-12 14:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: ../../assets/images/20200112_logging_in_powershell.png
tagline: 'Creating log files really is a necessary evil!'
tags:
- powershell
---

# Intro

I've been on a couple of projects recently where, at one point, I simply need to automate a certain task in Windows. These could be tasks as simple as generating a list of my git projects or as complex as xuploading a file to a server via an API. Anyway way you slice the task, there is one common idea: logging. 

# Why logging?

What if your script receives input that it doesn't expect? What happens if the API is offline? What happens if the script doesn't have permissions to read a git project file? If the script is automated with Windows Task Scheduler, you won't see any output. Therefore, you want something to be able to capture these failures on your behalf. This is where logging comes into play. Logging may seem like an afterthought but when you have a script running on a production system fail, you'll be happy that you don't need to spend hours "debugging in the dark"

# How do I log?

Logging can be as simple as using `Out-File` in powershell. For example,

```powershell
Try{
    Write-Host "Hello World"
    "The text was successfully written" | Out-File -FilePath "logs.txt" -Append
}catch{
    "The text was successfully written" | Out-File -FilePath "logs.txt" -Append
}
```

Notice that we use the `|` to feed the output of one command to the input of another. This is known as using a [pipeline](https://docs.microsoft.com/en-us/powershell/scripting/learn/understanding-the-powershell-pipeline?view=powershell-7) in powershell. In this case, we write a string value and pipe it into the Out-File command. The [Out-File](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/out-file?view=powershell-7) command takes a few switches/parameters that I use. 

* The `-FilePath` Parameter takes a string path of where the file is located that is going to be written.
* The `-Append` switch tells the command that we're going to append to the file rather than overwrite it.

# Keeping the File Size Down

By my use of the `-Append` switch, we can see that this can pose an issue. What happens when the file becomes too large? Plain text files don't get very large quickly because they're not storing any styling information but if you're automating this script on a task running daily or even hourly, this can still pose a threat. Fortunately, this information isn't necessary to keep for long periods. We can simply add the following code to the beginning of our script to delete the file if it's too large.

```powershell
$current_location = Get-Location
$log_file = "logs.txt"
$log_size = ((Get-Item "$($current_location)\$($log_file)").length/1MB)
# If the log is greater than 500MB, Delete it
if($log_size -gt 500){
    Remove-Item -Path "$($current_location)\$($log_file)"
}
```

In the example above, there are a few commands to go over:

* `Get-Location `simply gets the string path that the script is running currently. Although this isn't 100% necessary, we want to ensure that we are using the correct path.
* `Get-Item` will get several attributes of a file in a file object. We can use dot properties to get the specific attributes that we're after. In this case, we can get the file size with `.length`.
* Powershell has key phrases built in which represent a certain number. In our case `1MB` represents a shortcut to dividing by 1024 and by 1024 again. This is an easy way to see the number of megabytes of a file size.

Putting this all together, `$log_size = ((Get-Item "$($current_location)\$($log_file)").length/1MB)` gets the file size in megabyte and stores it in `$log_size`. We can now test to see if the log size is over 500 megabytes by writing `if($log_size -gt 500)`. If the file IS over 500MB, we simply delete it with `Remove-Item` before we start logging.

# Putting it all Together

Because `Out-File` will create the file if it doesn't exist, we simply just start logging after we test for the size. This is much easier than in other languages such as C# or Python where we need to instantiate a file object. This is just one of the many reasons that Powershell is so popular and powerful. Below is an example of a full script.

```powershell
$current_location = Get-Location
$log_file = "logs.txt"
$log_size = ((Get-Item "$($current_location)\$($log_file)").length/1MB)
# If the log is greater than 500MB, Delete it
if($log_size -gt 500){
    Remove-Item -Path "$($current_location)\$($log_file)"
}

Try{
    Write-Host "Hello World"
    "The text was successfully written" | Out-File -FilePath "logs.txt" -Append
}catch{
    "The text was successfully written" | Out-File -FilePath "logs.txt" -Append
}
```

Go ahead and use this to automate simple Windows tasks!


