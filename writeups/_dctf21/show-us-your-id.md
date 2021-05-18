---
title: Show us your ID
layout: post
author: panda1729
date: 2021-05-17 20:47:00 +0530
type: Misc
difficulty: Easy
prompt: 
---

This is a very straightforward challenge. But seeing the number of points anyone would spend hours analysing the pdf properly.

Skipping the time I wasted on analysing and extracting objects and reading writeups, here's the solution.

```
$ strings nyan.pdf | grep id

" id="646374667b3362306261347d"?> <x:xmpmeta xmlns:x="adobe:ns:meta/" 
[.....snipped.....]
```

That **id** is the flag.
```python
>>> bytes.fromhex('646374667b3362306261347d')
b'dctf{3b0ba4}'
```