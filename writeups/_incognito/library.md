---
title: Library
layout: post
author: Dark Demian
date: 2021-05-05 15:54:00 +0530
type: Pentesting
difficulty: Easy
prompt: https://tryhackme.com/room/bsidesgtlibrary
---

Firstly download the vpn configuration file from the tryhackme website and then
connect to it using openvpn.

Then start the machine and try to ping the ip to see if it is running.
![](/images/1.png)
now run a nmap scan on the given ip and you will find that port 80 /http is open
![](/images/2.png)
Since its and http port lets try to connect to it....
![](/images/3.png)
Now we need to find username and password....

so now the task is to find some hidden directories so i used gobuster with a
wordlist common.txt
![](/images/4.png)
and got two directories /assets and /database

on searching both i found the username and password to login to
[http://10.10.37.165/](http://10.10.37.165/)
![](/images/5.png)

And it worked !!! Now i got the following window.
![](/images/6.png)
Now our task is to somehow get the access to the shell so i found a php reverse
shell on github which worked fine -
https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-s
hell.php

## Change the ip in this code with your tunnel ip and put any port you want. I used
port 1234 here...

We can upload our php reverse shell by going to Books tab and then selecting
"New Book" option.
![](/images/7.png)

After uploading the reverse shell, now where to find the uploaded shell

So lets move to /assets directory and after searching the shell was present in
/assets/img folder. My reverse shell name is shell2.php..
![](/images/8.png)
Now we have to open a listening port in our terminal in order to get the access of
the shell...
Since i have used port 1234 in the "reverse shell" so i opened it using nc


command-
**nc -lnvp 1234
and we got the access!!!!**
![](/images/9.png)
Then our work was to find user.txt in the shell...
ohhh wait!! Lets first convert our shell to fully interactive TTY because when i used
su command it was not working so i found this command -
**python3 -c 'import pty; pty.spawn("/bin/bash")'**
then i found the user.txt file as -
**find / -type f -name 'user.txt' 2>/dev/null**
![](/images/10.png)
and also the terminal got a lot messy as clear command was not working so i
found this command to make this work out-
**export TERM=xterm**
And i found a user named 'cirius' so i used su command to login as cirius and his
password was **password** (just a guess)


Now we have full access to the shell so we can find our root.txt file now
**sudo find / -type f -name 'root.txt' 2>/dev/null**
Or you can also login as a root since its password was also password...
And finally we got the root.txt file as well...
![](/images/11.png)


