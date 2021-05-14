---
title: Glitch
layout: post
author: Bit Criminals Team
date: 2021-05-14 17:02:00 +0530
type: Pentesting
difficulty: Easy
prompt: https://tryhackme.com/room/glitch
---

We start with out routine Nmap scan which reveals that port 80 (running on Node js) is the only port open out of all 65535 ports.

![](/images/MaskdMafia/glitch3.png)

So we visit it in our browser to be greeted with this:

![](/images/MaskdMafia/glitch1.png)

The question gives an idea about some kind of access token.
Checking the source code of the webpage, we find this interesting function getAccess() which seems to be fetching something.

![](/images/MaskdMafia/glitch2.png)

So we execute the function in the console and get back a string which seems to be base64 encoded.

![](/images/MaskdMafia/glitch4.png)

So we decode it and get the Access token.

![](/images/MaskdMafia/glitch5.png)

Checking the Network Tab of the webpage shows us that the value of the token has not been entered yet, so we enter the value of our Access token and reload the page in the browser to get a different-looking webpage.

![](/images/MaskdMafia/glitch6.png)

Looking at the source code of the new webpage, we see a section /api/items so we try to access it in our browser.

![](/images/MaskdMafia/glitch7.png)

So we fire up BurpSuite to see what is happening when we try to access the page .
We see that while trying to send a post request to /api/items we get this message:

```py
{"message":"there_is_a_glitch_in_the_matrix"}
```