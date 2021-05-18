---
title: Scooby-Doo
layout: post
author: MaskdMafia
date: 2021-05-17 21:27:00 +0530
type: Crypto
difficulty: Easy(if you understand the hint)
prompt: What's the name of the van?
---

And this challenge was accompanied by a text file with some 22 characted long excrypted text for a seemingly endless amount of lines(just kidding, 10000 lines only).
Well,the name of the van is (as most of us cartoon network fans know) "The Mystery Machine". Well,thats a weird hint.
So I just googled "The Mystery Machine in cryptography" and i got results related to the Enigma Machine.

And the Enigma machine has rotors and offsets and a number of other things you have to define in order to crack the code. Finding this is difficult enough for one sentence,but 10000 line? Out of the question.So this challenge lay abandoned for quite some time before finally being taken up again and it turned out to be ***quite simple***.

So the hint of the challenge goes "1 flag:10000 settings".
Read up a bit more about the Enigma machine and found this super interesting piece of info.

```
• The Enigma encoding is symmetrical. As noted in the preceding section, if the A key
is transformed into the letter F, it must be the case that the F key would be transformed
into A for that particular rotor setting.
• The Enigma machine can never map a character into itself. Because of its
construction and the symmetry of the transformation, it is never possible to have the
letter A, for example, come back as the letter A.

```

So technically,the characters of the flag will never be in any of the 10000 lines.So here's the code:
```py
file1=open("cipher.txt","r")
Lines=file1.readlines()
list=[]
for line in Lines:
    list.append(str(line))
for x in range(0,22):
    abc="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    tmp=[]
    for line in list:
        tmp.append(line[x])
    tmpset=set(tmp)
    abcset=set(abc)
    print(abcset-tmpset,end="")

```
And it gave the flag . 

***Flag: DCTF{TURINGWOULDBEPROUD}***