---
title: VulnNet
layout: post
author: Bit Criminals Team
date: 2021-05-03 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/vulnnet1
---

Lets start with a nmap scan.On scanning we got port 80 and 22 port 

![](/images/D4rkDemian/vulnet.png)

On checking the website we got a nice vulnnet page which didn't had anything important...

And also in the prompt we are provided with a domain **vulnnet.thm**. So lets scan for subdomains using gobuster 

```shell
gobuster vhost -u vulnnet.thm  -w /usr/share/dns 
```

we found two subdomains in which only one was working but it required authentication password.

```
broadcast.vulnnet.thm
```

Firstly add both the domains with the box ip to /etc/hosts.

Now lets run gobuster on the website which is running.

![](/images/D4rkDemian/vulnet2.png)

On searching all the directories we found something worth in /js.It gave us the hint that there is LFI(Local File Inclusion) in this box..

![](/images/D4rkDemian/vulnet3.png)

Now lets check for /etc/passwd and it worked!!

![](/images/vulnet4.png)

After playing a lot with LFI we finally found a password hash in 
```
/etc/apache2/.htpasswd
```
![](/images/D4rkDemian/vulnet5.png)

On cracking the hash using john we found that the auth credentials for **broadcast.vulnnet.thm** are 

```
developers:9972761drmfsls
```

So we are inside the **broadcast.vulnnet.thm**

