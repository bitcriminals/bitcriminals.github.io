---
title: Time
layout: post
author: Bit Criminals Team
date: 2021-07-29 14:00:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://app.hackthebox.eu/machines/286
---

## Enumeration:
I found the following open ports in nmap scan:
![](/images/alphx/nmap1.png) 

On checking port 80 I found the following:
![](/images/alphx/http1.png)

I captured the request through burp and thus found the following:

![](/images/alphx/burp1.png)

![](/images/alphx/burp_request1.png)


On searching I found a specific article for CVE-2019-12384, that described te possibility of getting Remote Code Execution from deserialization. After looking a round I found an exploit on GitHub for getting the RCE: https://github.com/jas502n/CVE-2019-12384


Took the inject.sql file and changed the command to spawn a shell.
Now started my Python webserver so the script can grab the inject.sql file from my machine.
To spawn a shell I used the following command:
![](/images/alphx/shell_code1.png)


Now that the payload is ready, I have to make sure there is a listener running to grab the incoming connection.
Finally,I got the shell with users ‘pericles’.
![](/images/alphx/user_shell1.png)

![](/images/alphx/user_flag1.png)


## Root Flag:
I installed linpeas.sh
And found the suid binary or other vulnerability if present.

![](/images/alphx/linpeas1.png)
  
![](/images/alphx/script1.png)



SO it’s a cron file
I created and copied private rsa key in order to gain root priviledges.
  
![](/images/alphx/rsa1.png)

  
![](/images/alphx/root_access1.png)

  
![](/images/alphx/root_flag1.png)

  
![](/images/alphx/rootflag1.png)



Finally, Got the root flag!



