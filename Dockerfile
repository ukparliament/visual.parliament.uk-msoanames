FROM alpine:latest

MAINTAINER Oliver Hawkins "hawkinso@parliament.uk"

ENV MSOA_DB_HOST=$(MSOA_DB_HOST)
ENV MSOA_DB_PORT=$(MSOA_DB_PORT)
ENV MSOA_DB_NAME=$(MSOA_DB_NAME)
ENV MSOA_DB_USERNAME=$(MSOA_DB_USERNAME)
ENV MSOA_DB_PASSWORD=$(MSOA_DB_PASSWORD)

COPY . /app

WORKDIR /app

RUN apk update && \
    apk add --no-cache python3 python3-dev && \
    pip3 install --upgrade pip && \
    rm -r /usr/lib/python*/ensurepip && \
    apk add postgresql-libs && \
    apk add --virtual .build-deps gcc musl-dev postgresql-dev && \
    pip3 install -r requirements.txt && \
    apk --purge del .build-deps

COPY . .

EXPOSE 3001

CMD ["python3", "app.py"]
