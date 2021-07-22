---
title: Haskhell
layout: post
author: Bit Criminals Team
date: 2021-07-21 14:00:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/haskhell
---



#Enumeration
On enumeration we find two open ports: 22and 5001 running the following services:

![](/images/alphx/nmap.png)  
  
Running gobuster gave : /submit directory
  
![](/images/alphx/gobuster.png)  
 
#Vulnerable Web App and User Flag
Now, we can see /submit, /homework1  directories and thus found  a vulnerable Web App which accepts and runs haskell scripts.
  
![](/images/alphx/submit.png)  
    
we can submit the following haskell script and get private RSA key

#!/usr/bin/env runhaskell
import System.IO

main=do
    handle <-openFile "/home/prof/.ssh/id_rsa" ReadMode
    contents <- hGetContents handle
    putStr contents
    hClose handle
    
![](/images/alphx/privatekey.png)    

Now , we can get a ssh shell using this private key:

![](/images/alphx/shell-prof.png)

 and we can get the user flag now
 
 
 ![](/images/alphx/userflag.png)   
 
 
 #privilege Escalation
 
 we can see that */usr/bin/flask run* runs as root in the user prof
 and thus we can see its vulnerability in GTFObins and can get root access
 
 ![](/images/alphx/privilegeEscalation.png)
 
 
Thus we get root access and can get root user flag!

  
  



