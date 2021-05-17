---
title: Secure API 
layout: post
author: Dr.DONN4
date: 2021-05-17 17:00:00 +0530
type: Web
difficulty: Easy
prompt:
---

Link of the website:-http://dctf1-chall-secure-api.westeurope.azurecontainer.io:8080/

I first used gobuster to see any hidden directories and found one /login/.

But it didn't accept GET requests so I sent a random request with Burp and found out that it accepted only POST and OPTIONS request.

Hence , I sent a random POST request.

![](/images/dctf.png)

Thus we were missing the username and password field and thus I sent a request filling the username and passsword.

![](/images/dctf2.png)

We get a JWT token then to correct the token I logged into :https://jwt.io/

Before correcting I found the secret key for the token with the help og **john the Ripper**

![](/images/dctf4.png)

Then I changed the username to admin and also changed the secret key as was found by using john.

![](/images/dctf5.png)

Finally, we had to use this token in authorization header as header was missing.Here, I used the curl command as

```curl "http://dctf1-chall-secure-api.westeurope.azurecontainer.io:8080/" -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwIjoxNjIxMjUwOTk4fQ.VBs0OjuUdgzSW_K0jp2PO536v1j-KyDjK-YNrAXb4hYkphTtdWCCWr2826gPqpdjUG9BtfD3o_oEbVR7Abk_nA"```

And we have the flag

![](/images/dctf3.png)

***dctf{w34k_k3y5_4r3_n0t_0k4y}***
