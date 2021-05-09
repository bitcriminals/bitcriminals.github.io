---
title: Deserted Island Toolkit
layout: post
author: MaskdMafia
date: 2021-05-09 13:36:00 +0530
type: Audio/Radio
difficulty: Easy
prompt: What would a drunken sailor do? (Wrap the output in DawgCTF{ })

---

Unzipping the contents we find that we have been given a .iso file. So we extract the contents in a separate folder to find the following two extracted files :

![](/images/MaskdMafia/DawgCTF1.png)

Well, googling about .cdda files I found out that it is CD Digital Audio Format, so I went ahead and converted it to mp3 via an online convertor just for the sake of convenience.

[Online CDDA to MP3 convertor](https://convertio.co/cdda-mp3/)

Listened to the converted file and it sounded suspiciously like Morse Code, so yea, I took the freedom to go ahead and upload the file in an online Morse Code Decoder.

[Online Morse Code Decoder](https://morsecode.world/international/decoder/audio-decoder-adaptive.html)

And we got our flag!

![](/images/MaskdMafia/DawgCTF2.png)

Flag:***DawgCTF{SOSISNOTTHEAN5W3R}***