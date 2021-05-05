---
title: 'Solving Merge Conflicts using Visual Studio Code'
date: '2021-04-24 15:20:00'
updateTime: '2021-04-24 15:20:00'
author: 'Bill Jellesma'
authorImage: ../../assets/images/author/author-bjellesma.jpg
image: ../../assets/images/20210424_merge_conflicts.png
tagline: 'Merge Conflicts are completely natural and nothing to be ashamed of'
published: true
tags:
    - Git
    - Visual Studio Code 
---

1. Create a directory to house your project `mkdir MergeConflict && cd MergeConflict`

The type of project doesn't matter. Merge Conflicts apply to anything under source control. It could be Grandma's home brownie recipe. I just want to use Angular as the example to give more of a real world application.

2. Create a simple html file `touch index.html`

Use the following html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merge Conflict</title>
</head>
<body>
    <div>I think that if you're smart, you'll never run into merge conflicts in your code.</div>
    <script>
        while(true){
            console.log("conflict")
        }
    </script>
</body>
</html>
```

3. Put the entire directory under source control `git init`

4. Commit your first bit of code `git add . && git commit -m "my first commit"`

5. Create a new branch for the changes that you want to make `git branch development && git checkout development`

6. While on the development branch, suppose that we want to change the html to read a little different

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Merge Conflict</title>
</head>
<body>
    The guy before was wrong, merge conflicts are completely natural and nothing to be ashamed of
    <script>
        alert('hello world')
    </script>
</body>
</html>
```

7. Now, we want to go back to the master branch to commit these change `git add . && git commit -m "Change the index to be friendlier"`

8. Finally, we want to go back to the master branch and merge in these new changes `git checkout master && git merge development`

Uh oh, we have a merge conflict! Visual Studio will automatically open the file(s) in conflict and they will look as the follow.

![Merge Conflict](../../assets/images/20210413_merge_conflict.png)

Notice that over the merge conflict, you will four options:

* Accept Current Changes
* Accept Incoming Changes
* Accept Both Changes
* Compare Changes

You will also see that

```html
<div>I think that if you're smart, you'll never run into merge conflicts in your code.</div>
    <script>
        while(true){
            console.log("conflict")
        }
```

is currently part of the HEAD which means that it's currently what's on master branch. However, the conflict arose because git was unable to use the incoming changes from the development branch without giving up potentially useful content. Because git doesn't want to assume your choice, it's leaving the option up to you. Notice also that the closing script tag is not included in the merge conflict because git figures out that it doesn't need to be looked at. 

Accepting the current changes means that you will stick with

```html
<div>I think that if you're smart, you'll never run into merge conflicts in your code.</div>
    <script>
        while(true){
            console.log("conflict")git add . && git commit -m "Change the index to be friendlier"

and accepting incoming changes means that you will use 

```html
The guy before was wrong, merge conflicts are completely natural and nothing to be ashamed of
    <script>
        alert('hello world')
```

9. After clicking an option (we will accept incoming changes in our example), the file appears as any normal file that needs to be saved. We'll save the file and then `git add . && git commit -m "fix merge conflict"` as normal. 

![Resolve Conflict](../../assets/images/20210424_resolve_conflict.png)

In `git log`, you will now see "fix merge conflict" as a commit that mere the development branch to master.