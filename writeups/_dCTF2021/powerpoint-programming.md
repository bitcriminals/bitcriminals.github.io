---
title: Powerpoint Programming
layout: post
author: panda1729
date: 2021-05-17 20:47:00 +0530
type: Misc
difficulty: Medium
prompt: 
---

In this challenge we are given a Powerpoint file. It is a .ppsx file and double clicking it directly opens the file in presentation mode.

First open the file from Powerpoint and analyse the objects. While playing with the keys showed that there are transparent shapes on some keys. After tweaking a little more I realised that the whole password thing is controlled by animations.

I opened the animations pane and went through the sequence of objects. Clicking on the object in animations pane will highlight that object on slide.

![Powerpoint file animations pane](/images/panda/powerpoint.png)

I noted the characters manually and it was the flag.

`DCTF{PPT_1SNT_V3RY_S3CUR3_1S_1T}}`