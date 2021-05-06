---
title: DifferentCTF (TryHackMe)
layout: post
author: BIT Criminals Team
---
### Different CTf
### PenTesting

First,Start your machine from the TryHackMe website.Connect via OpenVPN and then, ping the ip to check whether it is running or not. 

**TASK 1**

Here,we first perform a basic Nmap scan.

```nmap -sV -sC -A <ip> ```

![](/images/nmap.png)

Clearly,we get **2 open ports**.

1.21-ftp 

2.80-ssl/http

We also get: http-server-header: Apache/2.4.29 (Ubuntu)

After the Nmap scan or along with it we can search for hidden directories with **gobuster**

```gobuster dir -u <ip> -w="/usr/share/wordlists/dirb/common.txt"```

I have used the common.txt wordlist you can use your own choice.Finally,after one eternity

![](/images/gobust.png)

we get a lot of directories and checking them the **/announcemnets** and the **/phpmyadmin** appeared juicy to me.

Opening the /aanouncements page,

![](/images/announ.png)


We get a jpg image and a wordlist which is quite interesting.
Now,we open the /phpmyadmin directory to find a login page.

![](/images/phpmyass.png)

Notice that in the /announcements/ page we got a picture and a wordlist.
Searching for steganographically hidden information using Stegseek on the given picture with the custom wordlist gives us a base64 string which , after decoding , gives us the username and password for ftp login .

![](/images/MaskdMafia/thm-differentCTF2.png)

So I logged in with the credentials and found the username and password of /phpmyadmin/ in the wp-config.php file

![](/images/MaskdMafia/thm-differentCTF3.png)

Logging in with the database credentials in /phpmyadmin shows us this page :

![](/images/MaskdMafia/thm-differentCTF4.png)

Checked the different tables and found this interesting table "wp-options" in phpmyadmin1 which led us to a domain : 
***http://subdomain.adana.thm***

![](/images/MaskdMafia/thm-differentCTF5.png)

