---
title: Just In Time
layout: post
author: ReversedEyes
date: 2021-05-19 17:15:00 +0530
type: Reversing
difficulty: Easy
prompt: Don't fall in (rabbit) holes
---

Using ``file`` on the file:
```s
$ file justintime 
justintime: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=62f8ef3708bd28228989d5aef4a9da8d6c16ca6a, for GNU/Linux 3.2.0, stripped
```
It's a typical reversing challenge. It can be decompiled in Ghidra or any other decompiler, and the logic can be reversed to get the flag.

But opening in Ghidra, we get function ``FUN_001014c5`` (let's call it the main function) from the ``entry`` function:

![](/images/ReversedEyes/justintime_1.png)

In this function, there's a lot of stuff happening. A lot of functions being called. I tried looking at some functions and there's a lot of work to do. But a rough idea of the main function is that it allocates memory for a character pointer and copies the result of a function into it. Then it gets passed as an argument to the next function for further operations, and so on.

By seeing this, I made an assumption: the flag would be returned from a FUN function and would be getting copied to a freshly allocated pointer. For copying, it uses the standard library function ``strncpy``. There's a debugging tool named ``ltrace`` which  intercepts and shows us information about calls to library functions. So if we use this tool, we can find the arguments for ``strncpy`` and thus get the flag (if our assumption is correct).

![](/images/ReversedEyes/justintime_2.png)

Bingo! We got the flag.
But it's only half displayed. Modifying the command a bit to show more characters:

![](/images/ReversedEyes/justintime_3.png)

We got the flag.

PS: I spent the majority of the time trying to reverse the logic in Ghidra. ;(