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

后在终端输入以下命令后，项目启动成功，from [ISSUE]

```zsh
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
ulimit -n 65536
```

[issue]: https://github.com/meteor/meteor/issues/8057
