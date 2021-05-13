---
title: Binary Bomb
layout: post
author: ReversedEyes
date: 2021-05-12 12:36:00 +0530 
type: Reversing
difficulty: Easy
prompt: Welcome to the CyberDawgs Binary Bomb challenge series! The "bbomb" binary contains a series of mini reversing challenges broken into 9 phases. Each phase becomes incresingly more difficult, but it is not required to solve a phase to move onto the next. Simply press enter for a phase's input to skip it. Additionally, known phase solutions can be stored in a file named "flags.txt". See the binary's welcome message for the format and requirements. When submitting to this scoreboard, wrap the phase's solution in DawgCTF{}. Happy reversing!
---

*This writeup covers the first 3 phases of the Binary Bomb challenge and is intented to be beginner friendly.*

For the 9 challenges of "Binary Bomb," we get one file. Upon applying the ``file`` command to it, we find it's an LSB executable file. It means that the file contains machine-level code, which can directly be executed to carry out some tasks. But the problem is that I don't speak or understand machine-level code or binary code. I hardly understand the C language. 

So how do we understand what's happening inside the binary file? We can run the binary file, but the problem is many-a-times, a binary file might not be safe to run. So what we can do is we can try to somehow get the source code back from the machine code.

We are living in modern times. People haven't written that executable in machine-level binary code. They have written it in programming languages like C, C++, etc., and compiled it to the binary file. So what we want to do is decompile this file to get that source code back, which we can make sense of. For decompiling a binary file, there are many tools out there. I'll be using Ghidra, which is free and does its work.

## Phase 1

Firstly, open Ghidra and create a new non-shared project from the "File" menu. Then you can import the file by going to the "File" menu > "Import File." Leave the settings at default and ignore any warnings and other stuff in the "Import Result Summary." Once done, you will be able to see the file under the "Active Projects." 

![](/images/ReversedEyes/BBomb_1.png)

Double click on that file to open that file. When the file opens, you'll see a dialog box asking if we want to analyze the file. Analyzing is decompiling the binary. So click "Yes," leave the settings to default, and hit "Analyze."

Once the analysis is finished, head over to the "Symbol Tree" on the left. Open up the Functions drop-down, and you'll get a list of all the functions in the binary. Seeing the list of functions, it seems that it is a simple C binary.

![](/images/ReversedEyes/BBomb_2.png)

There is a function name "_start" in the list. This is the starting function, you can say. It points to the main function, which in C is where the code written by the user starts. So click on the function name, and in the decompiler window on the right, you can see the decompiled code.

![](/images/ReversedEyes/BBomb_3.png)

In there, you can see "main". That points to the main function. Double click on "main," and you will then go to the function's source code. If you have a bit of knowledge about C, you'll find yourself in a familiar place. Now we can start to understand what the program does.

Now there might be a question in your mind, why don't we directly look for the main function in the "Symbol Tree" window. We can definitely do that, but why waste time searching for something that we can get with a few simple clicks. The main function might be hidden under some folders, and the _start function is right in front of our eyes.

The main function code is big. And I am not a great programmer, so it's hard for me to understand everything. How I like to approach a reversing challenge is firstly take a rough look over everything. Try to find out which part is actually essential. And just focus on that portion. Programs can be massive, and understanding each and everything in it is not required (at least in CTFs).

So with a rough look over the code, I saw some ``puts`` statements, a file named "flag.txt" being opened, and some phase functions. Since the Binary Bomb is divided into different phases, each phase function might correspond to each flag. This is my assumption. I might be wrong, and we might have to come back to the main function and go through the code again. But for now, let's go to the phase1 function's code.

You might notice that a variable named "local_188" is being passed to the function. I am a lazy guy. I'll return to the main function when the variable is actually being used somewhere. Often, parameters and variables go unused or get used in some non-essential task (from a CTF point of view). So I'll just ignore it for now.

![](/images/ReversedEyes/BBomb_4.png)

In the phase1 function, we see that some memory is being allocated using "calloc" for the character pointer "__s". In simple terms, calloc function reserves some memory and returns the first address of the memory, which is being pointed to by __s.

Next, there's a getInput function. We can definitely go and understand what that function actually does. But judging from the name and that it is taking __s as a parameter, we can safely assume that it takes input and stores it in __s. Again I might be wrong and we may be coming back but let's move forward.

Inside the while loop, there's a lot of things happening. But line 24 seems interesting. The if checks before it are mostly to find out when to break out of the while loop. 

```cpp
if ("Gn1r7s_3h7_Gn15Rev3R"[local_30] != __s[(long)((int)sVar2 - local_30) + -1]) {
```

So the variables being used in the checks are __s, local_30, and sVar2. We know that __s is the pointer to the input. If we go back a bit and try to find out what local_30 and sVar2, we find that local_30 is the function iterator and sVa2 holds the strlen of __s, the size of our input.

There's a lot of cast operators too. That's mainly because Ghidra decompiles the code, but it isn't perfect in it. So it wrongly assigns the type of some variables, which results in the type changes through cast operators. We can ignore that too, in this case.

As the loop progresses, local_30 goes from 0 to a higher value, while the sVar2-loc al30-1 goes from sVar2-1 to a lower value. It seems like it checks if the string we input is a reverse of the string "Gn1r7s_3h7_Gn15Rev3R". If you don't understand, try to dry run the code. Firstly the last character of input and the first character of the pre-defined string is checked, then the second last and second character, and so on. 

So I went to [Cyberchef](https://gchq.github.io/CyberChef/#recipe=Reverse('Character')&input=R24xcjdzXzNoN19HbjE1UmV2M1I) and reversed the string. And that's our first flag!

## Phase 2

![](/images/ReversedEyes/BBomb_5.png)

Let's move onto the phase2 function code. If you have gone through the phase1, you'll find the code is similar. So we look at line 20, the flag-rendering if statement:

```cpp
if ("Dk52m6WZw@s6w0dIZh@2m5a"[local_2c] != (byte)(__s[local_2c] ^ 5U)) {
```

Following the principles of ignorance and assumptions, and a bit of reversing, we find that this statement checks if the input when XORed with 0x5U is equal to the string "Dk52m6WZw@s6w0dIZh@2m5a."

We know that if we XOR ( A XOR B ) with A, we get B. So let's say A XOR B is "Dk52m6WZw@s6w0dIZh@2m5a" (the weird text), where B is the flag, and A is 05U. So [Cyberchef](https://gchq.github.io/CyberChef/#recipe=XOR(%7B'option':'Hex','string':'5U'%7D,'Standard',false)&input=RGs1Mm02V1p3QHM2dzBkSVpoQDJtNWE)!

That was easy

## Phase 3

![](/images/ReversedEyes/BBomb_6.png)

Phase 3 has a similar input code. But the while loop this time is totally different. Moreover, 2 more functions are being called in the while loop. 

![](/images/ReversedEyes/BBomb_7.png)

![](/images/ReversedEyes/BBomb_8.png)

They both have multiple if-else checks and do some operations based on the input. At first glance, it all looks complex and time-taking. So we can try a simpler approach: Brute Force. We know that each character of the flag can be only from a limited set of characters. So we try and put each character in the flag and check if it satisfies the requirements. 

We recreate the func3_1 and func3_2 and do the same operations as in the while loop. If the final string satisfies the comparison in line 21, we have found the flag. We do this check character by character to make it easier. Here's a python script for it:

```python
s="\"_9~Jb0!=A`G!06qfc8\'_20uf6`2%7"
l=len(s)
flag='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'
def func31(c):
    temp=''
    if '@'<c and c<'[':
        c=chr(ord(c)-13)
        if c<'A':
            temp=bytes.fromhex('1a').decode()
        else:
            temp=bytes.fromhex('00').decode()
        c=chr(ord(c)+ord(temp))
    if '`'<c and c<'{':
        c=chr(ord(c)-13)
        if c<'a':
            temp=bytes.fromhex('1a').decode()
        else:
            temp=bytes.fromhex('00').decode()
        c=chr(ord(temp)+ord(c))
    return c

def func32(c):
    temp=''
    if ' '<c and c!=bytes.fromhex('7f').decode():
        c=chr(ord(c)-47)
        if c<'!':
            temp='^'
        else:
            temp=bytes.fromhex('00').decode()
        c=chr(ord(c)+ord(temp))
    return c

for i in range(l):
    for j in flag:
        temp=func31(j)
        temp=func32(temp)
        if temp==s[i]:
            print(j,end='')
            break
```

But we are not reversing anything here. The reversing path is a bit complex. And the most important tool would be: ASCII Table: https://asciitable.com

At first, we take a look at the while loop. In simple terms, it iterates over each character of the flag, passes the character to the 2 functions, and the resulting string is then compared with a pre-defined string.
func3_1 takes a character and does some if checks on it. Comparing everything with the ASCII table, we get:

```
If character is upper case:
	Subtract 13 from it's ASCII value		- 1A.
	If the resulting character is less than "A":
		Add 26 to it's ASCII value		- 2A.
If character is lower case:
	Subtract 13 from it's ASCII value		- 1a.
	If the resulting character is less than "a":
		Add 26 to it's ASCII value		- 2a.
```

It's simple, right? Now let's reverse it!
The minimum and maximum possible character codes which don't satisfy 2A are 78 and 90. So they will only undergo subtraction of 13 from their ASCII code. In a similar way, I did the rest:

```
If 65 <= character code <= 77:
	Add 13
If 78 <= character code <= 90:
	Subtract 13
If 97 <= character code <= 109:
	Add 13
If 110 <= character code <= 122:
	Subtract 13
```

For func3_2, here's my reversal:
```
Add 0x2F
If character > "^":
	Subtract 94
```

Final code: (I was lazy to open VM and execute python script so I did it in browser using javascript)

```javascript
let a = "\"_9~Jb0!=A`G!06qfc8\'_20uf6`2%7"
let finalString = '';
a.split('').forEach(string => {
    if ( string >= '^') { 
        string = String.fromCharCode(string.charCodeAt(0)-94)
    }
    finalString += String.fromCharCode(string.charCodeAt(0) + 0x2f);
})
a = finalString;
finalString = '';
a.split('').forEach(string => {
    let b= 0;
    if ( string.charCodeAt(0) <= 77 && string.charCodeAt(0) >= 65 ) { b=-13 }
     if ( string.charCodeAt(0) <= 90 && string.charCodeAt(0) >= 78 ) { b=13 } 
    if ( string.charCodeAt(0) <= 109 && string.charCodeAt(0) >= 97 ) { b=-13 } 
    if ( string.charCodeAt(0) <= 122 && string.charCodeAt(0) >= 110 ) { b=13 }
    finalString += String.fromCharCode(string.charCodeAt(0) - b);
})
```


Running this we get the flag!
And that's it for this writeup... Happy Reversing!