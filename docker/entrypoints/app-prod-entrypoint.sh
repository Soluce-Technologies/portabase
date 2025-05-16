#!/bin/bash

echo "     ____             __        __                        "
echo "    / __ \____  _____/ /_____ _/ /_  ____ _________       "
echo "   / /_/ / __ \/ ___/ __/ __  / __ \/ __  / ___/ _ \      "
echo "  / ____/ /_/ / /  / /_/ /_/ / /_/ / /_/ (__  )  __/      "
echo " /_/    \____/_/   \__/\__,_/_.___/\__,_/____/\___/       "
echo "                                                          "
echo " Community Edition v1.0.0                                 "
echo "                                                          "


npx drizzle-kit migrate
node server.js

exec "$@"