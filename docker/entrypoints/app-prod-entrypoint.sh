#!/bin/bash

if [ -n "$TZ" ]; then
    if [ -f "/usr/share/zoneinfo/$TZ" ]; then
        ln -sf /usr/share/zoneinfo/$TZ /etc/localtime
        echo "$TZ" > /etc/timezone
        echo "[INFO] Timezone set to $TZ"
    else
        echo "[WARN] Timezone '$TZ' not found. Using default."
    fi
fi

node server.js

exec "$@"