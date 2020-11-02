# Inspired by: https://medium.com/blokur/how-to-implement-a-grpc-client-and-server-in-typescript-fa3ac807855e

# Not perfect... Need to improve part to "filter" the first argument

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
SCRIPT_NAME=`basename "$0"`

# Arguments:
# 1. path to js files output
# [2. path to typescript files output]
##    Otherwise, will be the same as the js output
# [3. file to build]
##    Otherwise, will build all proto file like: `*.proto`


# 0. Help
if [ "$1" = "-h" ] || [ "$1" = "--help" ] || [ "$1" = "help" ]; then
  echo "Usage: $SCRIPT_NAME js_out_path [ts_out_path] [proto_filter]"
  echo
  echo "Examples:"
  echo "\t../protos/$SCRIPT_NAME ./src/proto/"
  echo "\t../protos/$SCRIPT_NAME ./src/proto/js/ ./src/proto/ts/ messenger.proto"
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
    >&2 echo "Existing..."
    exit 1
  fi
fi



# 2. Collect arguments
JS_OUT="$1"
shift
if [ "$JS_OUT" = "" ]; then
  >&2 echo "Missing at least the js output path argument!"
  exit 1
fi

TS_OUT="$1"
if [ "$TS_OUT" = "" ] || ! [ -d "$TS_OUT" ]; then
  echo "Choosing same output for typescript!"
  TS_OUT="$JS_OUT"
else
  shift
fi

## Prefix the path with the user's current working directory
JS_OUT="$(pwd)/$JS_OUT"
TS_OUT="$(pwd)/$TS_OUT"

# ------------
# FIXME
# ------------
FIRST_BUILD_FILE="$1" # TODO improve with that
BUILD_FILES="$@"
if [ "$BUILD_FILES" = "" ]; then
  echo "Building all proto files!"
  BUILD_FILES="$DIR"/*.proto
fi

# ------------
# FIXME
# ------------
# Trying fixing it by prefixing the directory
if ! [ -e "$BUILD_FILES" ]; then
  BUILD_FILES="$DIR/"$BUILD_FILES
fi
if ! [ -e "$BUILD_FILES" ]; then
  >&2 echo "No target proto files found with: $BUILD_FILES"
  exit 1
fi



# 3. Build js and ts
echo
echo "Building js files..."
yarn --cwd "$DIR" run grpc_tools_node_protoc \
  --js_out="import_style=commonjs,binary:$JS_OUT" \
  --grpc_out="$JS_OUT" \
  --plugin=protoc-gen-grpc="$DIR/node_modules/.bin/grpc_tools_node_protoc_plugin" \
  -I "$DIR" \
  $BUILD_FILES

echo

echo "Building ts files..."
yarn --cwd "$DIR" run grpc_tools_node_protoc \
  --ts_out="$TS_OUT" \
  --plugin=protoc-gen-ts="$DIR/node_modules/.bin/protoc-gen-ts" \
  -I "$DIR" \
  $BUILD_FILES
