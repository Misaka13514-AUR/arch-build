#!/bin/bash

pkgname=$1

useradd builder -m
echo "builder ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
chmod -R a+rw .

cat << EOM >> /etc/pacman.conf
[archlinuxcn]
Server = https://repo.archlinuxcn.org/x86_64

[arch4edu]
SigLevel = Never
Server = https://mirrors.tuna.tsinghua.edu.cn/arch4edu/$arch

[lightquantum]
SigLevel = Never
Server = https://repo.lightquantum.me

[zhullyb]
SigLevel = Never
Server = https://mirror.zhullyb.top
Server = https://arch.zhullyb.top

[Clansty]
SigLevel = Never
Server = https://dl.lwqwq.com/repo/$arch
EOM

pacman-key --init
pacman -Sy --noconfirm && pacman -S --noconfirm archlinuxcn-keyring
pacman -S --noconfirm yay

sudo --set-home -u builder yay -S --noconfirm --builddir=./ "$pkgname"
