import random
import numpy as np
from pwn import *
import re

def givenum():
    num = random.sample(range(0,9), 4)
    return tuple(num)

def playresult(notknow, guess):
    A = 0
    B = 0
    for idx, val in enumerate(notknow):
        for idx2, val2 in enumerate(guess):
            if (idx == idx2 and val == val2):  # position & value are correct
                A = A + 1
            elif (val == val2):
                B = B + 1
    return A, B

def chooseone(code_set):
    remain_table = np.zeros(len(code_set))
    for idx, val in enumerate(code_set):
        code_idx = [j for j in range(len(code_set))]
        code_idx.remove(idx)

        S = random.sample(code_idx, len(code_idx))
        remain = 0
        for idxx in S:   #  each idxx acts like answer
            A, B = playresult(code_set[idxx], code_set[idx])
            for k in S:
                a, b = playresult(code_set[k], code_set[idx])
                if (a == A and b == B):
                    remain = remain + 1
        remain_table[idx] = remain
    mindex = np.argmin(remain_table)
    return code_set[mindex]

def checkresult(guess,r):
    r.recvuntil('>')
    r.sendline(''.join(str(i) for i in guess))
    result=r.recvline()[:-1].decode()
    if result=='':
        result=r.recvline()[:-1].decode()
    print(result.encode())
    if result=='Correct, onto the next one!':
        return (4,0)
    elif "Congratulations" in result:
    	print(result)
    else:
        try:
            A,B=[int(i) for i in re.findall(r'\d+', result)]
            return A,B
        except Exception as e:
            print(e)

def guess_cow_bull(code_set,r):
    #print(code)  # Create a code  
    # Initialize a set of code set containing possible answer

        # Create a first guess randomly
    guess = tuple(random.choice(code_set))
        # Get the A, B value with guess and code
    A, B = checkresult(guess,r)
    play_count = 1  # store the value of the number of guessing in this play

    while (A < 4):  # Still cleaning the code_set until we find the real answer
        play_count = play_count + 1
        code_set = [t for t in code_set if playresult(t, guess) == (A, B)]
        guess = chooseone(code_set)  # We use the chooseone function to pick the element in the code set for next play
        A, B = checkresult(guess,r)
        # Store the data to csv
        # show the average number of guessing
    return int(''.join(str(i) for i in guess)),play_count
