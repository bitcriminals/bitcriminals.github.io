---
title: En-pass
layout: post
author: Bit Criminals Team
date: 2021-06-08 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/En-pass
---

## STEP_1 ==> NMAP SCAN

![](/images/otaku_/en-pass_nmap.png)  

here we get a ssh and a http server.  


## STEP_2 ==> GOBUSTER  

starting with gobuster on sever.  

![](/images/otaku_/enpass_gobuster.png)  

now finding more in web directory  
![](/images/otaku_/enpass_gobuster_1.png)  

by looking more we get this directory ==> /web/resources/infoseek/configure/key
on this directory we get a ENCRYPTED ssh key.  

  
## STEP_3 ==> OPEN OTHER DIRECTORY

### 1 ==> reg.php
here we get a source code.
as here we can make many password that only consist of symbol and satisfyting these condition
```
strlen($val[0]) == 2) and (strlen($val[8]) ==  3 )
$val[5] !=$val[8]  and $val[3]!=$val[7]
```
so take input ==>  {@@,@@,@@,@@@,@@,@@,@@,@@@,@@@}
and we get password ==> {cimihan_are_you_here?}

### 2 ==> ./zip
here, we get nothing except files named sadman which furter will of no use

### 3 ==> 403.php
we get this directory by taking hint from the box.
here we open website and , now we have to bypass 403 error.

by using ==> https://github.com/intrudir/403fuzzer

command ==> python3 403fuzzer.py -u http://10.10.87.98:8001/403.php -hc 403,404,400 -p http://localhost:8080/

checking response from burp.  
![](/images/otaku_/enpass_burp.jpg)  
here we get username => {imsau}


## STEP_4 ==> DECRYPTYING SSH KEY
here we decrypt sshkey by using this command and password we get in step3.
command ==> openssl rsa -in key -out id_rsa


## STEP_5 ==> USER.TXT
OPEN SSH SHELL --> 
stabalising shell by command => /usr/bin/script -qc /bin/bash /dev/null
getting user.txt  

![](/images/otaku_/user_flag.png)  

 
## STEP_6 ==> ROOT.TXT  
here we get a file in this path
this is crontab so we have to apply same conditions as follows for privilage escalation  

![](/images/otaku_/enpass_root1.png)  

![](/images/otaku_/enpass_root2.png)  

![](/images/otaku_/enpass_root3.png)  

![](/images/otaku_/enpass_root4.png)  


