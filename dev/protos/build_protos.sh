# Inspired by: https://medium.com/blokur/how-to-implement-a-grpc-client-and-server-in-typescript-fa3ac807855e

# Not perfect... Need to improve part to "filter" the first argument

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME=`basename "$0"`

# Arguments:
# 1. path to js/ts files output
# [2. file to build]
##    Otherwise, will build all proto file like: `*.proto`


# 0. Help
if [ "$1" = "-h" ] || [ "$1" = "--help" ] || [ "$1" = "help" ]; then
  echo "Usage: $SCRIPT_NAME OUT_path [proto_filter]"
  echo
  echo "Examples:"
  echo "\t../protos/$SCRIPT_NAME ./src/proto/"
  echo "\t../protos/$SCRIPT_NAME ./src/proto/ messenger.proto"
  echo
  echo "\t(Note: '..' for like if we run this command from a different working directory)"
  exit
fi



# 1. Make sure the dependencies are installed
if ! [ -d "$DIR/node_modules" ]; then
  # Untested part
  >&2 echo "Missing node dependencies"

  read -p "Install them? " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
      yarn --cwd "$DIR" install
      echo
  else
    >&2 echo "Exiting..."
    exit 1
  fi
fi



# 2. Collect arguments
## 2.1. Get output folder
OUT="$1"
shift

if [ "$OUT" = "" ]; then
  >&2 echo "Missing at least the js output path argument!"
  exit 1
fi

if ! [ -d "$OUT" ]; then
  >&2 echo "The target directory has to exist first"
  exit 1
fi

### 2.1.1 Check if the path is absolute
# To fix if relative path, as it has the path has to be passed absolute, as we change
# The current working directory with invoking the yarn script
if [[ "$OUT" != /* ]]; then
  OUT="$(pwd)/$OUT"
fi



## 2.2. Get the proto files to compile
BUILD_FILES=()
while [ "$1" != "" ]; do
  # https://stackoverflow.com/a/6364244/3771148

  # 1. trust the user and check if any file exists
  if compgen -G "$1" > /dev/null; then
    BUILD_FILES+=("$1")

  # 2. try prefixing with the proto directory
  elif compgen -G "$DIR/$1" > /dev/null; then
    BUILD_FILES+=("$DIR/$1")

  # 3. partially trust the user and add proto extension
  elif compgen -G "$1.proto" > /dev/null; then
    BUILD_FILES+=("$1.proto")

  # 4. try prefixing with the proto directory and suffixing the proto extension
  elif compgen -G "$DIR/$1.proto" > /dev/null; then
    BUILD_FILES+=("$DIR/$1.proto")

  # 3. fail
  else
    >&2 echo "Couldn't match any file with argument $1"
    exit 1
  fi

  shift
done

if [ "${#BUILD_FILES[@]}" = "0" ]; then
  echo "Compiling all the proto files"
  BUILD_FILES=("$DIR/*.proto")
fi


# 3. Build js and ts
# https://developers.google.com/protocol-buffers/docs/reference/javascript-generated
# https://github.com/agreatfool/grpc_tools_node_protoc_ts
echo
echo "Building js files..."
yarn --cwd "$DIR" run grpc_tools_node_protoc \
  --plugin=protoc-gen-grpc="$DIR/node_modules/.bin/grpc_tools_node_protoc_plugin" \
  --js_out="import_style=commonjs,binary:$OUT" \
  --grpc_out=grpc_js:"$OUT" \
  -I "$DIR" \
  ${BUILD_FILES[@]}

echo
echo "Building ts files..."
yarn --cwd "$DIR" run grpc_tools_node_protoc \
  --plugin=protoc-gen-grpc="$DIR/node_modules/.bin/grpc_tools_node_protoc_plugin" \
  --plugin=protoc-gen-ts="$DIR/node_modules/.bin/protoc-gen-ts" \
  --ts_out="grpc_js:$OUT" \
  -I "$DIR" \
  ${BUILD_FILES[@]}
