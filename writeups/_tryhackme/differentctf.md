---
title: DifferentCTF
layout: post
author: Bit Criminals Team
date: 2021-05-06 17:02:00 +0530
type: Pen Testing
difficulty: Medium
prompt: https://tryhackme.com/room/adana
---

First,Start your machine from the TryHackMe website.Connect via OpenVPN and then, ping the ip to check whether it is running or not. 

### TASK 1

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

Now, I think we need to find a way to get a shell on the server. I remembered that there is an FTP server going on, logging into that with the credentials we found above.
After it logins, let's run the **ls** command and see what files are present on the server:

![](/images/FTPserver.png)

Seems like this could be a place from where we can upload our payload, but from where will we run it? Let's try visiting the domain we found out from the phpmyadmin site:

![](/images/ServerNotFound.png)

Hmmmm.....something is wrong. 
I added the IP of the box and the domain of the website to my **/etc/hosts** file:

![](/images/etchosts.png)

Now, I tried refreshing the site:

![](/images/subdomainthm.png)

Hurray! It worked! Now, let's browse the site a little. I did not find anything of importance on it, BUT note that if i opened the site **http://subdomain.adana.thm/index.php**, we find a webpage. Remember that index.png was also present in the ftp server, so maybe we can use this page to execute our payload.  
(Note that opening the page: http://<boxip>/index.php it opens too but I tried running the payload from this site and it doesn't work)
  
Now, let's upload our payload. I used the reverse shell payload from [here](https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php).  
(Note: Before uploading the shell, make sure to change the IP and the port to listen to in the shell to your tun0 IP and any empty port respectively.)  
It's time to upload!  
Login to the FTP server (make sure you were in the directory where your shell is before logging in).  
Now run: ```put <filename>```  
This should upload the file to the FTP server.

![](/images/reverseshellput.png)

Note that here we do not have permission to execute the file. Let's try changing that with:
```chmod 777 <filename>```

![](/images/chmod.png)

We can see that we now have permission to execute the file. Now it's time to execute it!
Let's set up a netcat listener on the port we just specified in our reverse shell payload using:
```nc -lnvp <port>```

Now let's go the site:  **http://subdomain.adana.thm/<filename>**
And we can see on our terminal (where we had set up the netcat listener) we have got our shell!

![](/images/gotshell.png)
