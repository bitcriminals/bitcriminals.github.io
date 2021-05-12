---
title: Really Secure Algorithm
layout: post
author: panda1729
date: 2021-05-09 12:22:00 +0530
type: Crypto
difficulty: Easy
prompt: >
    I like my e's like I like my trucks: big and obnoxious
---

Just a basic RSA challenge with a very big n. But here's the catch - n is a square! The totient function in this case is not (p-1)<sup>2</sup> but p(p-1)

Use [factordb.com](http://factordb.com) or `factordb-pycli` (or simply take the squareroot) to factorise the huge n and note the primes ('prime' actually since its just one)

[Download the file here](reallysecurersa.txt)

Fire up your python console and assign the respective values to n, p, e and c

```python
>>> phi = p*(p-1)
>>> d = pow(e, -1, phi)
>>> m = pow(c, d, n)
>>> bytes.fromhex(hex(m)[2:]).decode('utf-8')
'DawgCTF{sm@ll_d_b1g_dr3am5}'
```