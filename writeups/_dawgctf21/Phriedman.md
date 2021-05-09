---
title: Phriedman Systems
layout: post
author: Dr.DONN4
date: 2021-05-09 16:00:00 +0530
type: enumeration
difficulty: Medium/Hard
prompt: We want access to the CEO's secure data. Log in to their website using the CEO's account. https://phriedmansystems.onrender.com/
---

An Enumeration challenge,yupp but there is a twist.We were given a set of rule and damn you have to follow them:
```
1.This is primarily a Recon challenge.
2.There is NO password cracking, brute force, or password guessing required.
3.There is NO steganography of any sort required.
4.The onrender.com website is just used for hosting. Attacking Render is not a part of the challenge; do not attack Render or attempt to break into the backend.
5.You don't need to use anything on the Internet at all apart from phriedmansystems.onrender.com.
```
These were the rules given.
First you might run nmap but it will be of no use and you will get only a http and https port open.

Well,as port 80 was open so let us run gobuster.

![](/images/Phiredman1.png)

Now we enumerate through these directories we get something interesting in the /robots.txt/ and /login/.

Here's what we got from the /login/  directory

![](/images/Phriedman2.png)

Thus we basically have to enter the CEO's username and password to get access to the CE0's account
But,we can't bruteforce.

Moving through the various directories I got this page which seemed interesting.
![](/images/Phriedman3.png)

Now,bottom of this page we get an email:sleaver@phriedman.xyz which was email of Stephanie Leaver as you can see in the employee section of the page as well

If we put this in the username we get a green light.

![](/images/Phriedman4.png)

Thus,the username is basically the first letter of firstname followed by the last name.

Username for CEO Conard Smith:**csmith**

**Analyze the careers page**
Now,the password is left and this where I went crazy.I left the challenge and went out to get some fresh air and look what I found in the bottom of the careers page.
We have instructed to contact the HR for job enquiry so we might have to contact the IT for password inquiry.But,there was a note below that it's mail was down.I went crazy again.I didn't found anything in the social media as well.Then,I saw something that to contact HR we have to dial 3 in the same careers page.I thought that we might have to call
the company and yupp I was right.
Company's phone number was also given at the bottom left of the page.

Now,if you are from US you are a lucky guy.You can dial directly but if you are not then you can use Google voice.
In my case,even google voice was not eligible in my country and hence I asked the author for some help and he gave me a mail address and I called the company and
followed what was said in the call.

Basically,you have to call the company IT sector(dial 4) to get the CEO password.But,the CEO's password was very secure and there was a security question??.You will get the answer of this security question in the same call in the company's info(dial 1).

**Answer of the security question:Albany**

```Password of CEO's account=monkey_alpaca_excellent_button_7435```

Entering the details here's what we get:
![](/images/Phriedman5.png)

***FLAG:DawgCTF{y0ur_c4ll_1s_v3ry_1mp0rt4nt_t0_u5}***

