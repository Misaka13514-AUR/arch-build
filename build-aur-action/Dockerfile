FROM archlinux:latest

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN date
RUN pacman -Syu --noconfirm
RUN pacman -S base-devel git --noconfirm

RUN cat << EOM >> /etc/pacman.conf \
[archlinuxcn] \
Server = https://repo.archlinuxcn.org/x86_64 \
 \
[zhullyb] \
SigLevel = Never \
Server = https://mirror.zhullyb.top \
Server = https://arch.zhullyb.top \
 \
[Clansty] \
SigLevel = Never \
Server = https://dl.lwqwq.com/repo/x86_64 \
EOM

RUN pacman-key --init
RUN pacman -Syu --noconfirm
RUN pacman -S --noconfirm archlinuxcn-keyring
RUN pacman -S --noconfirm yay



COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"] 
