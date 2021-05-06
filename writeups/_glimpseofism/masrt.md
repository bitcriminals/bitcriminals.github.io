---
title: Masrt
layout: post
author: MaskdMafia
date: 2021-05-05 15:54:00 +0530
type: Crypto
difficulty: Medium
prompt: >
    Masrt was in a hurry, he wanted to get the challenges for Glimpse done asap before his vacation. Thinking Naughtyb0y wouldn't notice, he decided to encrypt several messages with the same key.

    
    But alas, he lost the original message during his vacation and only remembers that it started with "did". Can you save Masrt and his innocence?


    Being over-cautious, he also installed a pow system so that only select few get the encrypted messages.


    connect @ nc ctf.glimpse-of-ism.ml 6001

    use fr0st_is_my_arch_nemesis as access password
---

Connecting using the above command asks us to say the string which satisfies the condition: sha256(string)[-6:] --> xxxxxx

This seems like we have to bruteforce strings from a dictionary and run the comparison. Here is my code for that:

![](/images/MaskdMafia/glimpse1.png)

After running the comparison and sending the corresponding string prints out a 6 encrypted messages. Mine was:
![](/images/MaskdMafia/glimpse2.png)

Googling up write-ups and previous ctf challenges about same key encryption gives results about RSA, OTP and some more. Reading some OTP write-ups I get to know about the crib-drag attack or the known plaintext attack .Wait ,isn’t the beginning of our message known?

**it started with "did"**

So this might be the attack we are looking for ! 
Well frankly, I searched a lot more in order to get a hang of what it really is,and I came across this wonderful tool by Spiderlabs based on their DEFCon challenges

[SpiderLabs Cribdrag Tool](https://github.com/SpiderLabs/cribdrag)

Using this tool on the strings in pairs gave me my flag.
However, later I also made a script for solving the problem (pardon the clumsiness of the script) :

![](/images/MaskdMafia/glimpse3.png)

Oh! And here's the flag : ***masrt{think_out_of_the_box_yeager}***





