#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

ENV_FILE="$DIR/../.env"

if ! [ -e "$ENV_FILE" ]; then
    >&2 echo "Can't locate environment file in parent folder..."
    exit 1
fi

for file in `ls $DIR/*.proto`; do
    filename_ext=`basename $file` # thingy.proto for example
    filename="${filename_ext/.proto/}" # replace extension

    env_variable="`echo $filename | tr "[a-z]" "[A-Z]"`_PROTO"

    # 1. remove the previous entry
    sed "/$env_variable.*/d" "$ENV_FILE" > "$ENV_FILE.tmp"

    mv "$ENV_FILE.tmp" "$ENV_FILE"

    # 2. add the new entry in the env file
    # ... to complicated to replace with sed...
    sed 's/"/\\"/g' "$file" | awk -v name="$env_variable" 'BEGIN { printf "%s=\"", name } { printf "%s\\n", $0 } END { printf "\"" }' >> "$ENV_FILE"
    # 2.1 add a new line
    echo >> "$ENV_FILE"
done