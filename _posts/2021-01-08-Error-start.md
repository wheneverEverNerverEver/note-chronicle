---
layout: post
title: "Error: ENFILE: file table overflow"
date: 2021-01-08 16:52:00 +0800
categories: tool
summary: "启动项目发现报错 Error: ENFILE: file table overflow ...."
---

某日启动项目的时候，发现终端出现这样的内容：

```
  Could not load XXX: ENFILE: file table overflow, ....
```

原因 form [BLOG]：

> OSX has a ridiculously low limit on the maximum number of open files. If you use OSX to develop Node applications -- or even if you just use Node tools like grunt or gulp -- you've no doubt run into this issue.

后在终端输入以下命令后，项目启动成功，from [ISSUE]:

```zsh
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536
```

[issue]: https://github.com/meteor/meteor/issues/8057
[blog]: http://blog.mact.me/2014/10/22/yosemite-upgrade-changes-open-file-limit
