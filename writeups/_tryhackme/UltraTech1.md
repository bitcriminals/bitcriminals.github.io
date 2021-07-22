---
title: UltraTech
layout: post
author: Bit Criminals Team
date: 2021-06-22 16:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/ultratech1
---

## STEP_1 ==> NMAP SCAN

![](/images/whitefang/ultratech1_nmap.png)  

here we get a ssh at port 22 and a http server at 8081 and a non standard http porty 31331.

## STEP_2 ==> GOBUSTER  

starting with gobuster on port 8081.  

![](/images/whitefang/ultratech1_gobuster8081)  
  
![](/images/whitefang/ultratech1_gobuster31331)  

## STEP_3 ==> OPEN WEB

### 1 ==> at port 31331
open >/robots.txt then we get ->
```
/index.html
/what.html
/partners.html
```
now open >/partners.html
here open source of this page we get a js file named js/api.js
here code -->
```
function getAPIURL() {
    return `${window.location.hostname}:8081`
    }
    
    function checkAPIStatus() {
    const req = new XMLHttpRequest();
    try {
        const url = `http://${getAPIURL()}/ping?ip=${window.location.hostname}`
        req.open('GET', url, true);
        req.onload = function (e) {
        if (req.readyState === 4) {
            if (req.status === 200) {
            console.log('The api seems to be running')
            } else {
            console.error(req.statusText);
            }
```
here we can see ping function works on port 8081

## STEP_4 ==> COMMAND INJECTION
>http://[ip]:8081/ping?=[tun0ip]
here we get response ,now try another commands

![](/images/whitefang/ultratech1_ls)

![](/images/whitefang/ultratech1_cat)    

here we get hash . now cracking it by ![CRACKSTATION](https://crackstation.net/)

![](/images/whitefang/ultratech1_pass)
 
## STEP_5 ==> SSH
OPEN SSH SHELL --> 
here we get docker file

![](/images/whitefang/ultratech1_root)

>---------------------------------------------
