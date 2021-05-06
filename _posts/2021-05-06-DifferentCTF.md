---
title: DifferentCTF(TryHackMe)
layout: post
author: BIT Criminals Team
---
### Different CTf
### PenTesting

First,Start your machine from the TryHackMe website.Connect via OpenVPN and then, ping the ip to check whether it is running or not. 

**TASK 1**

Here,we first perform a basic Nmap scan.

```nmap -sV -sC -A <ip> ```

![](/images/nmap.png)

Clearly,we get 2 open ports.
1.21-ftp 

2.80-ssl/http

We also get: http-server-header: Apache/2.4.29 (Ubuntu)

After the Nmap scan or along with it we can search for hidden directories with **gobuster**

```
