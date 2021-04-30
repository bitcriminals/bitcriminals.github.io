---
title: Hacktober CTF
layout: post
author: Masrt
---

# Shoeless Hellhole

### Crypto

### Points: 400

## Solution

We were given a hex string and the clue a *Shoeless Hellhole*. I actually solved part of it, when I visited the ghosttown website for the first time!

`1c0b4f9a4c18130dc631186fd7356bd1e7ca8f75623382bca6aaa60d9482785d`

There was something regarding Shoeless Hellhole on a calculator 

[ghostown](https://www.ghosttown.xyz/t/no-treats-just-tricks/37/3)

A quick google search gives a blog about highschool students using the calculator to write some messages.

**1337 DUh!**

So SHOELESS HELLHOLE should become *54037355 43774073*!! But it was clearly said in those blogs that the message is readable when the calculator is read upside down... So in order for the message to be read SHOELESS HELLHOLE when upside down, we must type **37047734 55373045** !!

![down](Snips/Hacktober/upside.png)

See, it works!!

So, this must be key to the decrypting the hex-string! I tried xor and such at first but it didnt help. 

Notice the length of the key here... its 16, so if we take that in hex we get a 8 byte key! and what takes a 8 bytes key?? **DES**

[cyberchef soln](https://gchq.github.io/CyberChef/#recipe=DES_Decrypt%28%7B'option':'Hex','string':'3704773455373045'%7D,%7B'option':'Hex','string':'3704773455373045'%7D,'CBC','Hex','Raw'%29&input=MWMwYjRmOWE0YzE4MTMwZGM2MzExODZmZDczNTZiZDFlN2NhOGY3NTYyMzM4MmJjYTZhYWE2MGQ5NDgyNzg1ZA) *just coz its easy here*

So we get `VQW6+F7 Kings Park, New York` ... using this as the flag doesnt work! The location points to a un-named building in the Kings Park. You can see more images in the maps but just clicking the image tab in the google search gives you the result!

[google search](https://www.google.com/search?q=VQW6%2BF7+Kings+Park,+New+York&client=firefox-b-d&sxsrf=ALeKk00YaBOAnni71vsQvsK_Vvi97s65FA:1603011196322&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjUy7WH4r3sAhXz5nMBHcsdAPUQ_AUoAnoECAsQBA&biw=1536&bih=750)

Its the same brown building, *flag{Kings Park Psychiatric Center}*, those authors really made us feel nuts!
