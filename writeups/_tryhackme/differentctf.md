---
title: DifferentCTF
layout: post
author: Bit Criminals Team
date: 2021-05-06 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/adana
---

First,Start your machine from the TryHackMe website.Connect via OpenVPN and then, ping the ip to check whether it is running or not. 

## TASK 1

Here,we first perform a basic Nmap scan.

```shell
nmap -sV -sC -A <ip> 
```

![](/images/nmap.png)

Clearly,we get **2 open ports**.

1.21-ftp 

2.80-ssl/http

We also get: http-server-header: Apache/2.4.29 (Ubuntu)

After the Nmap scan or along with it we can search for hidden directories with **gobuster**

```shell
gobuster dir -u <ip> -w="/usr/share/wordlists/dirb/common.txt0"
```

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
Now run: 
```shell
put <filename>
```  
This should upload the file to the FTP server.

![](/images/reverseshellput.png)

Note that here we do not have permission to execute the file. Let's try changing that with:
```shell
chmod 777 <filename>
```

![](/images/chmod.png)

We can see that we now have permission to execute the file. Now it's time to execute it!
Let's set up a netcat listener on the port we just specified in our reverse shell payload using:
```shell
nc -lnvp <port> 
```

Now let's go the site:  **http://subdomain.adana.thm/<filename>**
And we can see on our terminal (where we had set up the netcat listener) we have got our shell!

![](/images/gotshell.png)

After getting the shell lets make it a proper stable tty shell.So to do this we need to use the following commands:-
#### python3 -c 'import pty; pty.spawn("/bin/bash")'
#### export TERM=xterm 
![](/images/tty.png)
Now our job is to find the Web flag.. which was lying in /var/www/html directory with the file name as wwe3bbfl4g.txt 
We found our first flag!!!
![](/images/flag1.png)

### www-data -> hakanbey :: Sucrack
after running linpeas.sh, linenum.sh and even then, not finding any way to escalate from www-data to the local user or root...  *ctf-like* thinking helped!

The room had a tag called sucrack (why something this random) (also never heard of it yet)
Looking it up,

`sucrack is a multithreaded Linux/UNIX tool for brute-force cracking local user accounts via su. This tool comes in handy as final instance on a system where you have not too many privileges`

So yea... need to use it to crack the user password!!!

But first, a wordlist always helps; rather than *spamming* rockyou lets kill our excitement and see what we have

Two passwords were previously found in this room
```txt
123adanaantinwar
123adanacrack
```

and any good eye will see that both begins with "123adana"! Hmm,,, lets craft a custom wordlist

So, I wrote a simple bash script,
```bash
#!/bin/bash
start="123adana"
input="wordlist.txt"
while IFS= read -r line
do
echo $start$line >> superlist.txt
done < $input
```
and uploaded the **superlist.txt** to the server

Compiling sucrack was the issue, many gave the error ```Exec Format Error```. Finally I found `sucrack_1.2.3-5+b1_amd64.deb` this deb file from [source](http://http.kali.org/pool/main/s/sucrack/) which worked.

```bash
$ cd /tmp
$ dpkg -x sucrack_1.2.3-5+b1_amd64.deb sucrack
$ sucrack/usr/bin/sucrack -w 100 -b 500 -u hakanbey superlist.txt   
```
`-w` was for threads, without that it takes forever. After 20 seconds or so, I got the password outputted by the program.

hakanbey:123adanasubaru


<br>

## Reversing The Binary

Using the file command, I found that /usr/bin/binary was an executable file. So let's run it:

![Testing /usr/bin/binary](/images/ReversedEyes/DifferentCTF_binaryAttempt1.png)

First thing that pops up in my head seeing this is reversing it using Ghidra (big mistake!). Since I had access to the website directory from the website, I copied the binary file to the website directory, gave it permissions and:

```shell
cp /usr/bin/binary ~/website/binary
chmod 777 ~/website/binary
```

then visited [http://subdomain.adana.thm/binary](http://subdomain.adana.thm/binary) to download the file in my local machine.

I started up Ghidra, imported, opened and analyzed the file with the default settings.

Then under the "Functions" dropdown in the "Symbol Tree" box on the left, select the "main" function, which is where the user code starts. On the right side, Ghidra shows the decompiled code. The code is 103 lines long, but all of it is not important. I ran the binary in the reverse shell earlier and got a basic idea of what it was doing. It asks the user for a string and if the string is as expected by the program, it does something. Probably which is what we want it to do.

So let's start looking at the code. If we see in line 48:
```c
__isoc99_scanf(&DAT_00100edd,local_138);
```
We see it has a "scanf" function which is what used to take input in C programs. So our input is being stored in the variable "local_138". If we look at the code around it:

![Ghidra screenshot for main function line 32-49](/images/ReversedEyes/DifferentCTF_GhidraScreenshot.png)

We find that the "local_138" variable is being compared with "local_1e8". And the result of the comparison is the deciding factor in further code execution. So we probably have to input a string which is equal to the value in "local_1e8".

Now the value of "local_1e8" at line 49 is a result of operations in lines 33-46. So we need to reverse these lines.

```c
local_1e8 = 0x726177;
```

Starting from line 33, local_1e8 is assigned 0x726177. After that some variables are being some values, and in lines 43-46:

```c
strcat((char *)&local_1e8,(char *)&local_1d8);
strcat((char *)&local_1e8,(char *)&local_1c8);
strcat((char *)&local_1e8,(char *)&local_1b8);
strcat((char *)&local_1e8,(char *)&local_1a8);
```
there are some concatenation operations which concat the value of local_1e8 with the values of local_1d8, local_1c8, local_1b8 and local_1a8. These variables are the ones who have been assigned some hex values in the previous lines. Note: the values are first being converted to strings, which means the hex values stored in these variables serve as the ASCII value for the characters of the string.

So we do the same operations in our machine. I used [Cyberchef](https://gchq.github.io/CyberChef/#recipe=From_Hex('Auto')&input=NzI2MTc3NjU2ZTZmN2E2ZTY5NjE2NDYxNjE2ZQ) for this. The output came as:

```
rawenozniadaan
```

Went to the reverse shell, executed the binary and input this string. But:

![Failed attempt at /usr/bin/binary](/images/ReversedEyes/DifferentCTF_binaryAttempt2.png)

Something went wrong ? It's a simple program so probably the logic wouldn't be incorrect. But one thing could have been missed: [Endianness](https://en.wikipedia.org/wiki/Endianness). The architecture of this binary follows little-endian so the letters should be reversed in order to get the correct answer. 

Since the string is small, I did this reversing manually:
2 hex digits form 1 character. The first hex number, "0x726177" corresponds to 6 digits which means 3 characters. So the first 3 characters, "raw" get reversed to "war". Then next "0x656e6f7a" corresponds to 4 characters, "enoz" and gets reversed to "zone". And so on.

The final string is:
```
warzoneinadana
```

And moment of truth:

![Success attempt at /usr/bin/binary](/images/ReversedEyes/DifferentCTF_binaryAttempt3.png)

it works!

Later, I realized that instead of doing all this, I could have simply used "ltrace" to trace library calls, and thus trace the call to strcmp(). With this, I could have directly got the parameters to strcmp function call:

![Regret](/images/ReversedEyes/DifferentCTF_binaryRegret.png)

and thus get the string!

Now,I got a file root.jpg on execution of 'binary' file.
As the shell doesn't support much of the tools like hexeditor(i checked for ghex,hexedit),exif command ,etc, I need to transfer the file into my own machine.
So for this, i opened a server on the shell by following command:

```shell
python3 -m http.server
```
![serverrr](https://user-images.githubusercontent.com/78094309/117415553-12985500-af36-11eb-85fa-3651ed6b8e11.png)


and used 'wget" command to ge the file

![server_getttint root](https://user-images.githubusercontent.com/78094309/117413716-eaa7f200-af33-11eb-9b3d-468eedfc6dea.png)


Now,comes the stage of analysing the file

I used hexeditor and luckily i founded the root password,  thus no need for the privilege escalation!

![hexedi](https://user-images.githubusercontent.com/78094309/117414132-6b66ee00-af34-11eb-94be-ebe1d660f59d.png)


I used cyberchef and thus got the root password!
![cyberchef](https://user-images.githubusercontent.com/78094309/117414183-79b50a00-af34-11eb-8d31-bf65f95fe41c.png)

Now, Simply obtain the root flag!


![root_flag](https://user-images.githubusercontent.com/78094309/117414423-bda80f00-af34-11eb-9c2a-66e4011430c3.png)






