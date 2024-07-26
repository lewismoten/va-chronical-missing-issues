import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

let paper = "WST";
const frequencyDays = 7;
const filePath = `paper-${paper}.html`;
const url = `https://virginiachronicle.com/?a=cl&cl=CL1&sp=${paper}&ai=1&e=-------en-20--1--txt-txIN--------`;

const main = async () => {
  if (!fs.existsSync(filePath)) {
    await download(url, filePath);
  }
  const html = read(filePath);
  const availableDates = parseDates(html);
  const missingDates = findMissing(availableDates);
  const csv = makeReport(availableDates, missingDates);
  fs.writeFileSync(filePath.replace('html', 'csv'), csv);
}

const download = async (url, filePath) => {
  const response = await fetch(url);
  const body = await response.text();
  fs.writeFileSync(filePath, body);
  console.log(`Web page downloaded to ${filePath}`);
}

const read = (filePath) => {
  return fs.readFileSync(filePath, 'utf-8');
}

const parseDates = (html) => {
  const pattern = /d=[A-Z]{3}(\d{4})(\d\d)(\d\d)/g;
  let match;
  const matches = [];
  while ((match = pattern.exec(html)) !== null) {
    const year = parseInt(match[1]);
    let month = parseInt(match[2]);
    const day = parseInt(match[3]);
    // this one is wrong...
    if (year === 1876 && month === 9 && day === 10) {
      month = 11;
    }
    const date = new Date(year, month - 1, day);
    matches.push(date);
  };
  console.log(`Available: ${matches.length}`);
  return matches;
}

const findMissing = (availableDates) => {
  const missing = [];
  for (let i = 1; i < availableDates.length; i++) {
    let priorDate = availableDates[i - 1];
    const currentDate = availableDates[i];
    while (dayDiff(priorDate, currentDate) > frequencyDays + 1) {
      priorDate = addDays(priorDate, frequencyDays);
      missing.push(priorDate);
    }
  }
  console.log(`Missing: ${missing.length}`);
  return missing;
}
const makeReport = (available, missing) => {
  const dates = [...available, ...missing];
  dates.sort((a, b) => a - b);
  return 'Date,Status\n' + dates.map(date => {
    const status = available.includes(date) ? 'Available' : 'Missing';
    return `${formatDate(date)},${status}`;
  }).join('\n');

}

const dayDiff = (start, end) => Math.floor(Math.abs(end - start) / (1000 * 60 * 60 * 24));
const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

const formatDate = (date) => {
  const month = String(date.getMonth() + 1);
  const day = String(date.getDate());
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;

  // return date.toISOString().slice(0, 10);
}
main();