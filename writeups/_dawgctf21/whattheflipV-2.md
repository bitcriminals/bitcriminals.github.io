---
title: What the Flip?!
layout: post
author: Dr.DONN4
date: 2021-05-08 22:00:00 +0530
type: Cryptography
difficulty: Medium
prompt: No Prompt
---

We are given a server and a script app.py.
## app.py
```python
import socketserver
import socket, os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad,unpad
from Crypto.Random import get_random_bytes
from binascii import unhexlify
from secret import FLAG


wlcm_msg ='########################################################################\n'+\
		  '#                            Welcome                                   #\n'+\
		  '#             All connections are monitored and recorded               #\n'+\
		  '#      Disconnect IMMEDIATELY if you are not an authorized user!       #\n'+\
		  '########################################################################\n'


key = get_random_bytes(16)
iv = get_random_bytes(16)
def encrypt_data(data):
	padded = pad(data.encode(),16,style='pkcs7')
	cipher = AES.new(key, AES.MODE_CBC,iv)
	enc = cipher.encrypt(padded)
	return enc.hex()

def decrypt_data(encryptedParams):
	cipher = AES.new(key, AES.MODE_CBC,iv)
	paddedParams = cipher.decrypt( unhexlify(encryptedParams))
	print(paddedParams)
	if b'admin&password=goBigDawgs123' in unpad(paddedParams,16,style='pkcs7'):
		return 1
	else:
		return 0

def send_msg(s, msg):
	enc = msg.encode()
	s.send(enc)

def main(s):

	send_msg(s, wlcm_msg)

	send_msg(s, 'username: ')
	user = s.recv(4096).decode().strip()

	send_msg(s, user +"'s password: " )
	passwd = s.recv(4096).decode().strip()

	msg = 'logged_username=' + user +'&password=' + passwd

	try:
		assert('admin&password=goBigDawgs123' not in msg)
	except AssertionError:
		send_msg(s, 'You cannot login as an admin from an external IP.\nYour activity has been logged. Goodbye!\n')
		raise

	send_msg(s, "Leaked ciphertext: " + encrypt_data(msg)+'\n')
	send_msg(s,"enter ciphertext: ")

	enc_msg = s.recv(4096).decode().strip()

	try:
		check = decrypt_data(enc_msg)
	except Exception as e:
		send_msg(s, str(e) + '\n')
		s.close()

	if check:
		send_msg(s, 'Logged in successfully!\nYour flag is: '+ FLAG)
		s.close()
	else:
		send_msg(s, 'Please try again.')
		s.close()


class TaskHandler(socketserver.BaseRequestHandler):
	def handle(self):
		main(self.request)

if __name__ == '__main__':
	socketserver.ThreadingTCPServer.allow_reuse_address = True
	server = socketserver.ThreadingTCPServer(('0.0.0.0', 3000), TaskHandler)
	server.serve_forever()
```
  
  Now let us peek into the code and see what we get.
  
  It is a AES CBC mode and seeing the code properly we see it is one of those bitflipping challenges in which we have to flip a bit.
  
  Now,let us login to the server 
  
  ![](/images/bitflip2.png)
  
  Cleary we can't login with admin and the given password.So,we login with bdmin and the given password.It will we easier to flip the bit in the username.
  And,we get the cipher text.Now,we read the code and see that the cipher text is actually the hex of 
  ```username='user'&password='pass'```
  
  and also there maybe some padding as well.
  
  Now,we check the length of our cipher text it's 96 which means 48 characters should be there in our input format as mentioned above.But there is only 44 so there is a padding of 4 characters.
  Thus,we have to flip the first bit ofcourse as we are allowed to do only that so that bdmin changes into admin and then put our cipher text answer.
  
  Now,I have done that by this process
  
  ![](/images/bitflip4.png)
  
  we find that decrypted(43) corrsponds b in the cipher text.
  
  Now,``` 0x6e ^ dec(b)=0x62``` which is the original hex of b.
  Thus, we can say that ```hex(0x6e ^0x62)=dec(b)```
  
  Once we find this we simply XOR:
   ```hex(dec(b) ^ hex('a'))``` to get the bit to replace the first bit
   
   ![](/images/bitflip5.png)
    
   Then, we put the new cipher text to get the flag
   
   ![](/images/bitflip3.png)
   
   I haven't got into any of the technical stuff of AES-CBC,but I have just explained the ***Bitflip attack.*** 
   
   ## flag=DawgCTF{F1ip4J0y}
     
     
   
  
