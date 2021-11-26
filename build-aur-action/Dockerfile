FROM archlinux:latest

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN date

WORKDIR /tmp
COPY pacman.conf.add ./

RUN cat /etc/pacman.conf ./pacman.conf.add > /etc/pacman.conf


RUN pacman-key --init
RUN pacman -Syu --noconfirm
RUN pacman -S base-devel git --noconfirm
RUN pacman -S --noconfirm archlinuxcn-keyring
RUN pacman -S --noconfirm yay



COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"] 
