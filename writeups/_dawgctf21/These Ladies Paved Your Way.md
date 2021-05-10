---
title: These Ladies Paved Your Way
layout: post
author: _Mars
date: 2021-05-09 18:10:00 +0530
type: Forensics
difficulty: Easy
prompt: Per womenintech.co.uk, these 10 women paved your way as technologists. One of them holds more than 100 issued patents and is known for writing understandable textbooks about network security protocols. What other secrets does she hold?
---

This challenge, though given under the forensics category, is more of OSINT :-)

Unzipping the 'WomenInTech.zip' creates a directory called 'images' which contains images of ten women.

The prompt clearly mentions that it needs the secret of a particular woman who has autored ```understandable textbooks about network security protocols``` and has ```100+ patents``` to her credit. So all we need to do is to identify her, given the ten women.


![](/images/_Mars/Dawg1.png)


Tried googling, but didn't find much (maybe I didn't do it properly). So I took a reverse approach. I googled the name of the first woman of the ten. But the requirments didn't tally. Then I took a chance and googled the last woman, and she was the one, ```Radia Perlman```.

Then applied steghide on her image, but this needed a paraphrase, which I didn't have. The next thought was to apply ```exiftool```.


![](/images/_Mars/Dawg2.png)


Then I found ```U3Bhbm5pbmdUcmVlVmlnCg==```, which seemed base64 encoded (bescause of the == at the end) and also ```VpwtPBS{r0m5 0W t4x3IB5}``` (looked like the encoded flag).

On decoding the base 64 string I got ```SpanningTreeVig```. The next thought was that this might be a Vigenère cipher, with the decoded base64 string as the key, and so it was!
On deciphering it I found the flag.

Flag: ***DawgCTF{l0t5 0F p4t3NT5}***
