---
title: Vulnet:Internal
layout: post
author: Bit Criminals Team
date: 2021-05-06 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/vulnnetinternal
---

Running a full port Nmap scan,I got some uncommon and interesting ports.

![](/images/nmap1.png)

Apart from these we also got 

![](/images/ports.png)

Thus we got ourselves **a SMB , NFS , redis and a rsync port** which appeared worthy of enumerating to me.

First a enumerate the SMB port 

![](/images/smb.png)

You can always tag help to know about the SMB port commnads if you have no idea
We get our first flag here.

After this,we enumerate the NFS port,

First we know about the directory to be mounted and then,mount it in our local machine.

![](/images/nfs.png)

After, that we find a redis directory in the mounted dir.Within, the redis dir we found a redis.conf file.

Within the redis.conf file we found a password
***B65Hx562F@ggAZ@F***
which is most probably the password for the redis port.

Now we connected to rsync and got the user flag in the sys-internal User's directory

![](/images/rsync.png)

```User flag : THM{da7c20696831f253e0afaca8b83c07ab}```

Now we created an id_rsa key and using rsync transferred this key to authorised keys folder in the sys-internal User's directory 
The commands are:

```py
ssh-keygen -f ./id_rsa
rsync -ahv ./id_rsa.pub rsync://rsync-connect@<ip>/files/sys-internal/.ssh/authorized_keys
ssh -i ./id_rsa sys-internal@10.10.53.133
![](/images/ssh.png)
```

And then we connected using ssh to the machine..

![](/images/ssh2.png)
