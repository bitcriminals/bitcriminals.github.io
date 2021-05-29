---
title: Forgotten Secret
layout: post
author: Masrt
date: 2021-05-29 17:54:00 +0530
type: Crypto
difficulty: Medium
prompt: Last month we hired a new junior DevOps Enginner to migrate all our services into containers. He was super hyped about Docker and in such a hurry, that he forgot about best practices. You want to use one of our images? Sure, no problem. Just download image file, run "docker load < image" and you are ready to go!
---

After extracting the file and analyzing we find 3 things:

```
1. SECRET_KEY=58703273357638792F423F4528482B4D6251655468566D597133743677397A24 from the file 7dabd7d32d701c6380d8e9f053d83d050569b063fbcf7ebc65e69404bed867a5.json
2. image\ee6ac2faa564229d89130079d3c24dcb016b6818c2a8f3901ad2a7de1fdb0faf\layer.tar\root\.ssh\id_rsa
3.cipher.bin from image\df6e2b0dba838bcc158171c209ae2c7b8aeec4a8638a2fa981abda520233a170\layer.tar\home\alice\cipher.bin
```

```
ssh-keygen -f id_rsa -e -m pem -p 
# -f  takes file as input
# -m convert to specified format here "PEM"
# -p used to get private key; if not specified it will return the public key
# -e to read a public/private key
```
so using -p asks for the old password
turns out the SECRET_KEY was the old password

```bash
┌──(root:skull:Masrt)-[~/…/Ctfs/dctf21/Crypto/Forgotten_secret]
└─# ssh-keygen -f id_rsa -e -m pem -p
Enter old passphrase: 
Key has comment 'root@kali'
Enter new passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved with the new passphrase.
```

It asks for a new passpharse... skip that

do cat id_rsa and we will have the "RSA private key" in it instead of the "SSH private key"

use the following command to get the flag :

```
openssl rsautl -decrypt -inkey id_rsa -in cipher.bin  -out flag
```

***flag:dctf{k33p_y0r_k3ys_s4f3}***