---
title: The Obligatory RSA Challenge
layout: post
author: panda1729
date: 2021-05-09 12:22:00 +0530
type: Crypto
difficulty: Easy
prompt: Would you believe last year someone complained because we didn't have any RSA challenges?

---

Just like the previous RSA challenge of this CTF, `n` is again a square and can be factored easily.

[Download the file here](rsa.txt)

Find the factors ('factor' actually) using [factordb](factordb.com) and assign the values of n, p, e & c in the python console.

Totient function when p and q are equal is `p(p-1)`

```python
>>> phi = p*(p-1)
>>> d = pow(e, -1, phi)
>>> m = pow(c, d, n)
>>> bytes.fromhex(hex(m)[2:]).decode('utf-8')
'DawgCTF{wh0_n33ds_Q_@nyw@y}'
```