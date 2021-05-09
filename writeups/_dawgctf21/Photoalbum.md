---
title: Photo Album
layout: post
author: MaskdMafia
date: 2021-05-09 14:15:00 +0530
type: Forensics
difficulty: Medium
prompt: Your grandparents forgot the password to their online photo album! Lucky for you, they only ever use simple passwords and you’re a UMBC CS student. Make them proud.
---

This challenge provided us with a really large zip file ( around 157 mbs ), and while unzipping it asks for the password. Using John the Ripper to crack the hash with rockyou.txt yields no results. 

And then there's the weird prompt:

**Lucky for you, they only ever use simple passwords and you’re a UMBC CS student**

So, I tried crafting my own custom wordlists with different combinations of capital letters then small and finally, one wordlist was able to crack the zip file.

```py
with open("wordlists.txt", "w") as p:
    for i in range(4000):
        p.write("umbc" + str(i) + '\n')
    for i in range(4000):
        p.write(str(i) + "umbc" + '\n')
        
```

![](/images/MaskdMafia/DawgCTF3.png)

This unzips all the photos inside the zip file. Using the file command on the second file shows it has ASCII text instead of picture. And using the cat command on the second file gives our flag.

![](/images/MaskdMafia/DawgCTF4.png)

Flag: ***DawgCTF{P1ctur35qu3}***