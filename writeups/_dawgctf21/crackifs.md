---
title: Crack IFS
layout: post
author: D4rkDemian
date: 2021-05-09 12:36:00 +0530 
type: Fwn (Forensics/Web/Network)
difficulty: Easy
prompt: The accounts in this QNX IFS have insecure passwords. Crack them to assemble the flag.
---

# Solution

we were provided an .ifs file which is a file system image of a Blackberry device so we need to dump the image i used this github tool to dump the files 
[dumpifs](https://github.com/askac/dumpifs)
so i dumped using following command:

```py
./dumpifs ../DawgCTF.ifs -d ../dump -x -b
 ```

![](/writeups/_dawgctf21/ifs1.png)

On searching i found the shadow file in the dump and as from reading the prompt it is clear that the passwords are very weak...
So i used John the ripper to crack the hash but firstly we need to create our own wordlist.
On enumerating i found that all the passwords are 4 character long so i wrote a script to make a wordlist:

```py 
import string
s = string.printable
print(s)
with open("wordlist.txt","w") as f:
    letters = string.printable
    for i in letters:
        for j in letters:
            for k in letters:
                for l in letters:
                    word=i+j+k+l

                    f.write(word + '\n') 
```

Now i ran john 
`john --rules shadow -w=wordlist.txt`
![](/writeups/_dawgctf21/ifs2.png)

And hence we got our flag!! 
`DawgCTF{un_scramble}`
