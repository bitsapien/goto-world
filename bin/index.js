#!/usr/bin/env node

/* TODO
 * Add option to use last executed command as input to "add"
 * Add bash autocomplete
 * Support params
 * Support non-url kind of commands
 * Support special actions like @
 * Add version to file and move commands into another object
 * Add automated tests for each command
 * Analyse bash histroy or zsh history and suggest commands to add
 * Give an option to select type of command
 * Create a version for browsers that does the same
 * Did you mean, for close matches
 */

const fs = require('fs');
const url = require('url');
// constants.js
const xdgDataHomePath = (process.env.XDG_DATA_HOME ?? process.env.HOME + "/.local/share") + "/goto-world";
const DATA_FILE = "data.json";
const COMMANDS = [
  {command: 'add', desc: "Add a shortcut", usage: 'goto add <shortcut> <value>' }, 
  {command: 'rm',  desc: "Remove a shortcut", usage: 'goto rm <shortcut>' }, 
  {command: 'ls', desc: "List all shortcuts.", usage: 'goto ls' }
];
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
  } else if(data[key]) {
    // assuming it's a shell command
    exec(`${data[key]}`, (error, stdout, stderr) => {
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
  } else {
    console.error(`${key} not found. Add it? \n goto add ${key} <value>`)
  }
  return 
} 

function help() {
  console.table(
    COMMANDS.map(command => {
      return {
        "Option": command.command,
        "Usage": command.usage,
        "Description": command.desc,
      };
    })
  );
}

function add(data, key, value) {
  if(COMMANDS.map((a)=> a.command).includes(key)) {
    console.error(`${key} is a reserved keyword, use something else.`);
    return;
  }
  data[key] = value;
  fs.writeFile(`${xdgDataHomePath}/${DATA_FILE}`, JSON.stringify(data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`Added ${key} to list, use \`goto ls\` to check.`);
    }
  });
  
}

function rm(data, key) {
  if(!data[key]) {
    console.log(`Shortcut: ${key} not found`);
    return;
  }
  delete data[key];
  fs.writeFile(`${xdgDataHomePath}/${DATA_FILE}`, JSON.stringify(data), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log(`Deleted ${key} from list, use \`goto ls\` to check.`);
    }
  });
  
}

function list(data) {
  console.table(Object.keys(data).map(shortcut => ({
    "Shortcut": shortcut,
    "Destination": data[shortcut],
  })))
}

function init(datapath, filepath) {
  // Create a folder
  fs.mkdir(datapath, (err) => {
    if (err) {
      if(err.code === "EEXIST") {
        return
      }
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

// init if not found
init(xdgDataHomePath, DATA_FILE);
const data = readJSONFile(`${xdgDataHomePath}/${DATA_FILE}`);

// Switch based on command
switch(firstArg) {
  case 'help':
    help();
    break;
  case 'add':
    add(data, secondArg, thirdArg);
    break;
  case 'ls':
    list(data);
    break;
  case 'rm':
    rm(data, secondArg);
    break;
  default:
    executeCommand(data, firstArg, secondArg);
}
// Define schema of data file
// ** add <shortcut> <command> **
// Verify entry
// Add to file
// ** main **
// look for command and execute
// if not found, print option to add
