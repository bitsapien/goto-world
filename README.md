# GOTO World 🌎

Quick access "your world" using the terminal.

## Installation

```sh
npm i -g goto-world-js 
```

Optionally add the following to your shell config (eg: `zshrc`)
```zshrc
alias goto=g
```

## Usage
#### ➕ Add new shortcuts 
  ```sh
  goto add cal https://calendar.google.com/
  ```
#### 😎 Use the shortcut to open up your calendar
  ```sh 
  goto cal
  ```
#### 📜 List all shortcuts
  ```sh
  goto ls
  ```
#### ❎ Remove a shortcut
  ```sh
  goto rm cal
  ```
#### 😿 Help
  ```sh
  goto help
  ```


## Known Issues 😾

1. The solution currently only works on Macs.
2. It only can open URLs for the moment.


## Contributions
Feel free to contribute to the project. 😻

No guide at the moment, the project is pretty nascent. See a list of [TODOs](https://github.com/bitsapien/goto-world/blob/main/bin/index.js#L14).



