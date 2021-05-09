---
title: Phriedman Systems
layout: post
author: Dr.DONN4
date: 2021-05-09 16:00:00 +0530
type: enumeration
difficulty: Medium/Hard
prompt: We want access to the CEO's secure data. Log in to their website using the CEO's account. https://phriedmansystems.onrender.com/
---

An Enumeration challenge,yupp but there is a twist.We were given a set of rule and damn you have to follow them:
```
1.This is primarily a Recon challenge.
2.There is NO password cracking, brute force, or password guessing required.
3.There is NO steganography of any sort required.
4.The onrender.com website is just used for hosting. Attacking Render is not a part of the challenge; do not attack Render or attempt to break into the backend.
5.You don't need to use anything on the Internet at all apart from phriedmansystems.onrender.com.
```
These were the rules given.
First you might run nmap but it will be of no use and you will get only a http and https port open.

Well,as port 80 was open so let us run gobuster.

![](/images/Phiredman1.png)

Now we enumerate through these directories we get something interesting in the /robots.txt/ and /login/.

Here's what we got from the /login/  directory

![](/images/Phriedman2.png)

Thus we basically have to enter the CEO's username and password to get access to the CE0's account
But,we can't bruteforce.

Moving through the various directories I got this page which seemed interesting.
![](/images/Phriedman3.png)

Now,bottom of this page we get an email:sleaver@phriedman.xyz which was email of 
