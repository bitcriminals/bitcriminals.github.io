---
title: Dr. Hrabowski's Great Adventure 
layout: post
author: _Mars
date: 2021-05-09 18:45:00 +0530
type: Web
difficulty: Easy
prompt: President Freeman Hrabowski is having a relaxing evening in Downtown Baltimore. But he forgot his password to give all UMBC students an A in all their classes this semester! Find a way to log in and help him out.
---

This challenge had the link "http://umbccd.io:6100" and a note which says "If you get an SSL error, try a different browser".
I got this error so as instructed, used a different browser.
I got this login page.

![](/images/_Mars/Dawg3.png)

Tried basic SQL injection. Gave <1' or 1=1 -- -> (without the angular brackets) as username and some random password. Got logged in!

![](/images/_Mars/Dawg4.png)

Looked around, but didnt find anyting useful. The opened the 'Network' tab under Inspect. Searched a bit, and then found the flag in the response header of 'home.php'.

![](/images/_Mars/Dawg5.png)

Flag: ***DawgCTF{WeLoveTrueGrit}***
