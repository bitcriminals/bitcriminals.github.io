---
title: Ruby
layout: post
author: panda1729
date: 2021-05-06 15:54:00 +0530
type: Crypto
difficulty: Medium
prompt: Not given
---

The prompt is too straight forward. It’s just the description of a problem, nothing hidden between the lines and no tricks used here – just pure mathematics.

This is a really interesting (and mind-blowing ofc) problem. At first it seems that its impossible to convey so much information with just a flip of coin but the world is a mysterious place!

This is indeed a valid puzzle (aka the impossible chessboard problem or impossible escape problem) and luckily for us, it has already been solved.

Explaining the solution on this writeup will take forever so here are some resources: - 

THE VIDEO THAT EXPLAINS THE PROBLEM: https://www.youtube.com/watch?v=wTJI_WuZSwE

THE VIDEO WHICH HAS THE SOLUTION TO PROBLEM:
https://www.youtube.com/watch?v=as7Gkm7Y7h4

THE VIDEO WHICH HAS THE SOLUTION TO PROBLEM AND IS SHORT:
https://www.youtube.com/watch?v=ZtfhkH9H0V8 

Also, go ahead and try your hands on this interactive setup:
https://datagenetics.com/blog/december12014/index.html

Coming to the solution.

I’m about to reveal my favourite tool – Python

```python
from pwn import *

r = remote('ctf.glimpse-of-ism.ml', 9001, level = 'debug')

received = r.recv(2048)
print(received)
r.sendline(b"petro_wale_soo_lucky")

while True:
    received = r.recv(2048)
    received = list(received.split(b"\n"))
    board = []
    x = received.index(b'---------------------------------')
    c = 0
    for i in range(17):
        line = received[x+i]
        if c==0: c=1
        else:
            row = []
            d = 0
            print(line)
            for char in line.split(b" "):
                if char == b"H": row.append(0)
                elif char == b"T": row.append(1)

            board.append(row)
            c = 0
    print(board)
    d1, d2, d3, d4, d5, d6 = 0, 0, 0, 0, 0, 0

    for i in range(8):
        for j in range(1, 8, 2):
            d1+=board[i][j]

    for i in range(8):
        for j in [2,3,6,7]:
            d2+=board[i][j]

    for i in range(8):
        for j in range(4,8):
            d3+=board[i][j]

    for i in range(1, 8, 2):
        for j in range(8):
            d4+=board[i][j]

    for i in [2,3,6,7]:
        for j in range(8):
            d5+=board[i][j]

    for i in range(4,8):
        for j in range(8):
            d6+=board[i][j]

    digits = [d6,d5,d4,d3,d2,d1]

    for i in range(6):
        if digits[i]%2==0: digits[i] = 0
        else: digits[i] = 1

    ans = int("".join(str(i) for i in digits), 2)
    r.sendline(str(ans))
```

There’s a better solution to this problem – using XOR.
Apply XOR on all the positions on checkboard with heads facing up, and that is the answer.

**And Done!**
