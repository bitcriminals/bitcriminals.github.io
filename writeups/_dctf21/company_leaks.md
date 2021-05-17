---
title: Company Leaks
layout: post
author: D4rkDemian
date: 2021-05-17 20:47:00 +0530
type: Misc
difficulty: Medium
prompt: Someone hacked and leaked some very important data from an evil company. Find their dirty secrets and expose them!
---

We got a zipped file named **Leaked.zip** from the challenge.So we unzipped it and got a README.md and another zip named super_secret.zip

Now comes the interesting part since we only had a zip so we can try to hashcrack it using john, but it all went in vain...

On solving we got to know that the **super_secret.zip** also contains a README.md file which is similar to that we have currently!!

So we remembered a perfect github tool named pkcrack which can crack the zip if we have a copy of atleast one file which resides inside the locked zip.

You can read about the tool from [here](https://github.com/keyunluo/pkcrack) 

We ran following bash script to download and install pkcrack in our terminal.

```shell
#!/bin/bash -ex

wget https://www.unix-ag.uni-kl.de/~conrad/krypto/pkcrack/pkcrack-1.2.2.tar.gz
tar xzf pkcrack-1.2.2.tar.gz
cd pkcrack-1.2.2/src
make

mkdir -p ../../bin
cp extract findkey makekey pkcrack zipdecrypt ../../bin
cd ../../
```
Firstly add the in hand README.md file into a zip file as i added it to secret.zip and then ran this command

![](/images/D4rkDemian/company.png)

```shell
./pkcrack  -C super_secret.zip -c "README.md" -P secret.zip -p "README.md" 
```

![](/images/D4rkDemian/company1.png)

After running it we got three keys which we can now use to decrypt the super_secret.zip using **zipdecrypt**

And after unzipping our secret.txt we got our flag just as simple..

![](/images/D4rkDemian/company2.png)

```
dctf{wew_lad_y0u_aCtually_d1d_it}
```
 
