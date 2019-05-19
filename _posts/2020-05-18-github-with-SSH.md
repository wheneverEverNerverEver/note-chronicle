---
layout: post
title:  "github SSH"
date:   2019-05-18 09:52:00 +0800
categories: tool
summary: "当你新安装了 git 后 在使用时，提示 Permission denied (publickey) 错误...."
---


当 github 提示错误 Permission denied (publickey) 时
![image](/assets/images/sshin.png)
你可以尝试以下步骤

#### 一、本地生成 SSH

命令行输入
```
ssh-keygen -t rsa -b 4096 -C "email@example.com"
``` 
回车键之后会有几个问题，你可以一直都按回车键
![image](/assets/images/SSH.png)

#### 二、将生成的 SSH 保存到 GitHub `Personal settings` 设置里的 `SSH keys`中

这里你可以使用这一条命令粘贴上一步生成的 SSH key

```
pbcopy < ~/.ssh/id_rsa.pub

```
需要注意 `pbcopy` 后的路径，如果你在上一步生成 SSH 的命令下对这个问题`Enter file in which to save the key (/Users/zhouzhou/.ssh/id_rsa):` 没有做更改的话，你可以直接用复制的命令。

最后，你只需在 github 设置中的 `SSH and GPG keys` 中，通过 `new SSH key` 或者 `Add SSH key` 按钮添加即可。

更详细的步骤：[github 官方][more]


[more]:https://help.github.com/en/articles/adding-a-new-ssh-key-to-your-github-account
