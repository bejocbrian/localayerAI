FROM alpine:3.20

ARG PB_VERSION=0.24.4

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    && wget -qO /tmp/pb.zip https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip /tmp/pb.zip -d /pb/ \
    && chmod +x /pb/pocketbase \
    && rm /tmp/pb.zip

RUN mkdir -p /pb/pb_data /pb/pb_hooks && chmod -R 777 /pb

WORKDIR /pb

EXPOSE 8090

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090"]
