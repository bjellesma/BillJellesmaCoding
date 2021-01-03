---
title: 'I have the Powershell'
date: '2018-12-21 23:00:00'
updateTime: '2018-12-21 23:00:00'
author: 'Bill Jellesma'
authorImage: '../../assets/images/author/author-bjellesma.jpg'
image: '../../assets/images/20190905_powershell/header.jpg'
tagline: 'Using Powershell to manage your systems is a gateway on the addiction of automation.'
tags:
- github
---
# TL;DR

* While Command Prompt is great for quick and dirty solutions, Powershell enables you to automate tasks with powerful solutions
* CMD is still available and Microsoft plans to keep it that way but the default shell is now Powershell
* The powershell ISE, natively available with modern Windows computers, is a powerful development environment for working on powershell scripts
* Powershell code is easy to remember and easier for others to read "at a glance"

# History

Powershell, and command line interfaces, have quite the extensive history.

Dating back to MS-DOS, Windows 9x, and Windows ME, the default shell was `command.com`. No, this was not a website, although fan made sites have sprung up since then. Nowadays, [command.com](https://www.command.com) is a website feature the handy household command strips by 3M (Sidenote, I've used 4 of them in the past week). Command.com was the first program run at startup of Windows computers and many other starting scripts were run from it. It was a DOS based program and, therefore, any program run from it was limited to the DOS API. I fondly remember launching Sim City 2000 from command.com

In subsequent versions of Windows and still available today is `cmd.exe`. `cmd.exe` looked and felt like `command.com` and is even backwards compatible with all of the commands of `command.com` but added some advantages to make it similar to the Unix-like bash. All of the nuances offered by `cmd.exe` can be read about [here](https://en.wikipedia.org/wiki/Cmd.exe#Comparison_with_MS-DOS_Prompt) but one feature that I would not be able to live without today is the use of arrow keys to scroll through command history. `cmd.exe` took hold as the default shell from Windows XP and is only being replaced as the default today with Windows 10. It is important to note that even though it is being phased out as the default shell, it is still available in Windows 10 and has no plans of being moved.

Powershell first came out with its version 1.0 release in 2006 and was available as an optional download for Windows XP Service Pack 2, Windows Server 2003, and higher. Powershell was also natively bundled with Windows Server 2008. Powershell was a huge shift from `cmd.exe` with its commands in the form of `verb-noun`, its similarity to modern day programming languages, and its ease to connect to remote computers, just to name a few of powershell's improvements. Moving forward in our timeline, Powershell 2.0 was released in 2009 and came natively with Windows 7 and Windows Server 2008 R2, though it was also available as a download for Windows XP Service Pack 3.

Several, other versions of Powershell have come about since:

| Version  | Release Month and Year | Native Integration |
| ------------- | ------------- | ------------- |
| Version 3.0  | Septemeber 2012  | Windows 8, Windows Server 2012 |
| Version 4.0  | October 2013  | Windows 8.1, Windows Server 2012 R2 |
| Version 5.0  | February 2016  | Windows 10 |
| Version 5.1  | January 2017  | Windows 10 Anniversary Update, Windows Server 2016 |

As of this writing, December 2018, Powershell 6.0 Core is available as of November 2018. Powershell Core is a seperate download and is not as powerful as Powershell 5.1 because a decreased use of the .NET framework. There are two major differences here for the new Powershell Core:
1. Powershell is now open source and available on the now Microsoft owned [Github](https://github.com/PowerShell/PowerShell)
2. You can now download powershell for MacOSX and many distributions of Linux. Powershell even has experimental downloads for mobile and rasberry PI

# With a little help from my friends

For starters, it's very useful to see every command available to powershell. This is easily accomplished with the `Powershell ISE`.

On Windows 7 and higher, powershell is installed by default and along with it is the `Powershell ISE`. This is a powerful IDE to develop powershell scripts, run them without having to use PAUSE, have intellisense to autocomplete commands, highlight syntax, autoformat loops, etc.

To open `Powershell ISE`, simply press start on your computer and search for `powershell ISE` (x86 should work just fine if that pops up). You should now have the following on your screen:

![Powershell ISE](https://msdnshared.blob.core.windows.net/media/2016/02/hsg-2-5-16-01.png)

*TIP: If the script pane does not automatically show, press <kbd>CTRL</kbd> + <kbd>R</kbd>*

In order to get help about any command in powershell, we can simply type `get-help <command>`. For example:

```powershell
get-help add-computer
```

Will yield the following output

```powershell
NAME
    Add-Computer

SYNTAX
    Add-Computer [-DomainName] <string> -Credential <pscredential> [-ComputerName <string[]>] [-LocalCredential <pscredential>] [-UnjoinDomainCredential <pscredential>] [-OUPath <string>] [-Server <string>] [-Unsecure] [-Options {AccountCreate |
    Win9XUpgrade | UnsecuredJoin | PasswordPass | DeferSPNSet | JoinWithNewName | JoinReadOnly | InstallInvoke}] [-Restart] [-PassThru] [-NewName <string>] [-Force] [-WhatIf] [-Confirm]  [<CommonParameters>]

    Add-Computer [-WorkgroupName] <string> [-ComputerName <string[]>] [-LocalCredential <pscredential>] [-Credential <pscredential>] [-Restart] [-PassThru] [-NewName <string>] [-Force] [-WhatIf] [-Confirm]  [<CommonParameters>]


ALIASES
    None


REMARKS
    Get-Help cannot find the Help files for this cmdlet on this computer. It is displaying only partial help.
        -- To download and install Help files for the module that includes this cmdlet, use Update-Help.
        -- To view the Help topic for this cmdlet online, type: "Get-Help Add-Computer -Online" or
           go to https://go.microsoft.com/fwlink/?LinkID=135194.



```


# The Code

One reason that I really like Powershell is that the code is a lot more descriptive and feels a lot more natural. For example, to delete an item in batch files and `cmd.exe`, you would use `rmdir /s <folder name>` to remove a directory and `del <file name>` to delete a file; to do the equivalent in powershell, you would use `Remove-Item -path <folder name>` or simply `Remove-Item <file name>` to delete a file. This example illustrates how powershell "cmdlets" (powershell commands are given this easy to remember name) are both easier to remember and easier for anyone viewing this file to understand at a glance.

The following are some small scripts in batch and their powershell counterparts.

**Note: PAUSE is used in the scripts because if you execute the scripts from the GUI rather than the terminal, they will exit before you are able to see the output**

## Prompting for user input

### Batch

In batch files, to prompt the user for input, you will use the set command with the "/p" switch
```batch
@echo off
set /p new_variable="Please enter a value for this variable: "
echo %new_variable%
PAUSE
```

### Powershell

```powershell
$new_variable = Read-Host -Prompt 'Please enter a value for this variable: '
Write-Host "The value is '$new_variable'"
PAUSE
```

As an added bonus, you can ensure that you get the type of user input that you are looking for with a type cast

```powershell
[int]$new_variable = Read-Host -Prompt 'Please enter a value for this variable: '
Write-Host "The value is '$new_variable'"
PAUSE
```

To take things even further and more graciously handle the error, we can wrap this in a `try-catch` statement

```powershell
try{
    [int]$new_variable = Read-Host -Prompt 'Please enter a value for this variable: '
    Write-Host "The value is '$new_variable'"
}catch{
    Write-Host "The input is not in the correct format"
}
PAUSE
```

## Reading from a file

Both examples assume that `file.txt` is in the same directory as the script

### Batch

You need to use a for loop to iterate through each line of the file

```batch
FOR /F %%i IN (file.txt) DO @echo %%i
PAUSE
```

### Powershell

```powershell
Get-Content -Path file.txt
PAUSE
```

## Join a computer to a domain

The netdom command can only be invoked if you are either on a Windows Server or are using Remote Server Administration Tools

### Batch

```batch
netdom join /d:mydomain.com %COMPUTERNAME% /ud:[USER] /pd:[PASSWORD]
```

### Powershell

What I like a lot about the powershell command is that it will prompt for your password so that you don't need to hardcode it to the script

```powershell
Add-Computer "my-domain" -Credential ME
```

Lastly, here is a little more applicable example of a powershell function to automate installations.

## Installations with powershell

I found it useful to use a function to installer from installers because the process is slightly different if the file is an MSI rather than an EXE. This example assumes that the string filename is loaded into the `$file` variable

```powershell
<#
# function to install a file
# :param $file - string filename
#>
function installer($file){
  # A little fancy string manipulation to find the extension on the filename
  $extention = $file.Substring($file.LastIndexOf(".") + 1)
  if($extention -eq "msi"){
    # We need to use msiexec.exe to run the MSI file as an argument
    #We use $($file) to neatly concatenate the variable in our string
    Start-Process -FilePath "C:\Windows\System32\msiexec.exe" -ArgumentList "/I $($file)"
  }Elseif($extention -eq "exe"){
    # if the file is an EXE, we can simply start the process
    Start-Process $file
  }
```

# Resources

[Read file text in powershell](https://www.business.com/articles/powershell-read-text-files/)

[Windows Command Prompt is not disappearing](https://www.computerworld.com/article/3149115/operating-systems/follow-up-ms-dos-lives-on-after-all.html?nsdr=true)
