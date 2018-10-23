FROM tiangolo/uwsgi-nginx-flask:python3.6-alpine3.7

MAINTAINER Oliver Hawkins "hawkinso@parliament.uk"

ARG PARLIAMENT_API_VERSION
ARG OPENSEARCH_DESCRIPTION_URL
ARG OPENSEARCH_AUTH_TOKEN
ARG AIRBRAKE_PROJECT_ID
ARG AIRBRAKE_PROJECT_KEY
ARG BANDIERA_URL
ARG APPLICATION_INSIGHTS_INSTRUMENTATION_KEY
ARG RAILS_LOG_TO_STDOUT

ENV PARLIAMENT_API_VERSION $PARLIAMENT_API_VERSION

ENV MSOA_DB_HOST visual-msoanames.web1devci.org

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

ENV LISTEN_PORT=3001
EXPOSE 3001
