build:
  #!/usr/bin/env bash

  bun run build
  google-chrome --pack-extension=$PWD/dist --pack-extension-key=$HOME/.chrome-webstore-private-key.pem
  realpath dist.crx
