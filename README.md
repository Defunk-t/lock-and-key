<div align=center>

# Lock & Key

A cross-platform desktop password manager application.

</div>

## Status

This project is currently under early development. As such, it is subject to change drastically and break horribly. You should probably use something more mature like [KeeWeb](https://github.com/keeweb/keeweb).

# About

Lock & Key is a password management application built in Electron around the [OpenPGP.js](https://openpgpjs.org) library. It uses key-based asymmetric encryption to manage and store secrets, such as usernames and passwords, locally on your device.

# How to Use

Go to the [releases tab](https://github.com/Defunk-t/lock-and-key/releases) and grab the packaged executable for your system.

| Platform | Executable                       |
|:--------:|:---------------------------------|
| Windows  | `lock-and-key [version].exe`     |
|  Linux   | `lock-and-key-[version.AppImage` |

> Electron can build for MacOS but I haven't bothered configuring that yet because I don't have a Mac (and don't plan to have one either).

Alternatively, build the project for your platform yourself:

```sh
# Clone repo (have Git installed)
git clone https://github.com/Defunk-t/lock-and-key.git

# Enter cloned project directory
cd lock-and-key

# Install required packages to node_modules folder
npm install

# Build for target platform
npm run build:windows # Build for Windows
npm run build:linux   # Build for Linux
```
