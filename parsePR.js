const fs = require('fs');

// Read the PR body from the file
const prBody = fs.readFileSync('./pr_body.txt', 'utf8');

// Define a regular expression to match the test classes
const regex = /Apex::\[(.*?)\]::Apex/;
const match = prBody.match(regex);

let testsToRun = '';

// If a match is found, extract the test classes
if (match && match[1]) {
  testsToRun = match[1];
} else {
  // Default to running all tests if no specific tests are mentioned
  testsToRun = 'all';
}

// Write the test classes to testsToRun.txt
fs.writeFileSync('./testsToRun.txt', testsToRun);

console.log(`Extracted tests: ${testsToRun}`);
