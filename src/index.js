#!/usr/bin/env node

/* *******************************************************************  
 * Design
 * ******************************************************************/

/* The command will have the following options:
 * 1. init                     - Initialises a file for command config 
 * 2. add <shortcut> <command> - Add the command
 */

/* TODO
 * Add option to use last executed command as input to "add"
 * Add bash autocomplete
 */

const fs = require('fs');
const url = require('url');
// constants.js
const xdgDataHomePath = (process.env.XDG_DATA_HOME ?? process.env.HOME + "/.local/share") + "/goto-world";
const DATA_FILE = "data.json";
// lib.js
function readJSONFile(filePath) {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error("No command file found, run `goto init`");
    return null;
  }
}

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
}
const { exec } = require("child_process");

function executeCommand(data, key, params) {
  // detect type
  if(isUrl(data[key])) {
    exec(`open ${data[key]}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`); 
    })
  }
  
  return 
} 

function add(data, key, value) {
  data[key] = value;
  fs.writeFile(`${xdgDataHomePath}/${DATA_FILE}`, JSON.stringify(data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File has been written successfully.');
    }
  });
  
}

function init(datapath, filepath) {
  // Create a folder
  fs.mkdir(datapath, (err) => {
    if (err) {
      console.error('Error creating folder:', err);
      return;
    }

    // Create a file inside the folder
    const fileContent = '{}';

    fs.writeFile(`${datapath}/${filepath}`, fileContent, (err) => {
      if (err) {
        console.error('Error creating file:', err);
        return;
      }

      console.log(`File created at ${datapath}/${filepath}`);
    });
  });
}
// Read cmd line arguments
const args = process.argv.slice(2);
const firstArg = args[0];
const secondArg = args[1];
const thirdArg = args[2];

let data;
if(firstArg !== "init") {
  // look for file, show error and ask to run init.
  data = readJSONFile(`${xdgDataHomePath}/${DATA_FILE}`);
  if(!data)
    return
}


// Switch based on command
switch(firstArg) {
  case 'init':
    init(xdgDataHomePath, DATA_FILE);
    break;
  case 'add':
    add(data, secondArg, thirdArg)
    break;
  default:
    executeCommand(data, firstArg, secondArg)
}
// Define schema of data file
// ** add <shortcut> <command> **
// Verify entry
// Add to file
// ** main **
// look for command and execute
// if not found, print option to add
