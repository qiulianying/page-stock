FROM nginx:1.17-alpine


ENV TZ="Asia/Shanghai"

RUN apk update && apk add tzdata curl \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' >/etc/timezone \
    && mkdir -p /app/page-stock/otherh5 \
	&& mkdir -p /app/page-stock/h5/

COPY ./mysed /app/mysed
COPY ./otherh5 /app/page-stock/otherh5/
COPY ./h5 /app/page-stock/h5/
COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./entrypoint.sh /app/entrypoint.sh

RUN chmod a+x /app/entrypoint.sh

ENTRYPOINT /app/entrypoint.sh
