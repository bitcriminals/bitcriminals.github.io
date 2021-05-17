---
title: Bad Apple
layout: post
author: panda1729
date: 2021-05-17 20:47:00 +0530
type: Misc
difficulty: Medium
prompt: 
---

We have a video(.mp4), hearing the full length reveals some weird noises in the middle. 
The first tool for investigating these noises is **Sonic Visualizer** but it can't be directly used for mp4 files.

First we convert the video to mp3 and then open the song in Sonic Visualizer.

Navigate to the part of song which had weird noises and add the spectrogram.

![Bad Apple Spectrogram](/images/panda/badapple1.png)

This looks like a QR code but can't be scanned directly. Adjust the scales a little (with the knobs at the bottom-right corner of workarea). Change the color and adjust the contrast a little.

The final QR code should looked like this.

![Bad Apple Spectrogram](/images/panda/badapple2.png)

Got the flag after scanning this!

`dctf{sp3ctr0gr4msAreCo0l}`