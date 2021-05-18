from pwn import *
from cow_bull import guess_cow_bull,checkresult
from itertools import permutations
from sage.all import *

def unique(n):
    return len(set("%04d" % n)) == 4

def ini_population(iters):
    population = permutations(iters, 4)
    return list(population)

all = ["%04d" % n for n in range(10000) if unique(n)]

r=remote('dctf1-chall-lockpicking.westeurope.azurecontainer.io',7777)
r.recvline()


ULTIMATE_GUESS=''.join([str(i)*2**i for i in range(10)])
def best_guess():
	
	A,B=checkresult(ULTIMATE_GUESS,r)
	iters=[i for i,bit in enumerate(bin(B+A)[2:].zfill(10)[::-1]) if bit=='1']
	code_set=ini_population(iters)

	if A==1:
		if 0 in iters and 1 not in iters and 2 not in iters:
			code_set=[item for item in code_set if item[0]==0]
		elif 2 in iters and 1 not in iters and 0 not in iters:
			code_set=[item for item in code_set if item[3]==2]
		elif 1 in iters and 0 not in iters and 2 not in iters:
			code_set=[item for item in code_set if item[2]==1 or item[1]==1]
	# my clumsy optimization lol, I hate it
	return code_set


state=[]
TURNS=260
for i in range(20):
	code_set=best_guess()
	n,ct=guess_cow_bull(code_set,r)
	state.append(all.index(str(n).zfill(4)))
	TURNS-=ct+1

print("REMAINING: ",TURNS)
if TURNS<180: exit()

state_matrix=[state[i:i+10] for i in range(10)]
M=Matrix(Zmod(5039),state_matrix)
V=vector(Zmod(5039),state[-10:])

coeff=M.solve_right(V).list()

for i in range(180):
	guess=0
	for i,j in zip(coeff,state[-10:]):
		guess+=i*j

	guess=guess%5039
	state.append(guess)
	guess=all[guess]
	checkresult(list(str(guess)),r)