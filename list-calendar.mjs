import { readFileSync } from 'fs';

const cal = JSON.parse(readFileSync('liturgical-calendar-2026.json', 'utf8'));

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║              LITURGICAL CALENDAR 2026 - ALL SUNDAYS & FEASTS                 ║');
console.log('╠══════════════════════════════════════════════════════════════════════════════╣');
console.log('║ Pascha (Easter): ' + cal.pascha + '                                                    ║');
console.log('║ Pentecost:       ' + cal.pentecost + '                                                    ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');
console.log('');

let currentCat = '';
let weekNum = 0;

cal.sundays.forEach((s, i) => {
  if (s.category !== currentCat) {
    currentCat = s.category;
    console.log('');
    console.log('┌─────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ ' + currentCat.toUpperCase().padEnd(75) + '│');
    console.log('├─────────────────────────────────────────────────────────────────────────────┤');
    weekNum = 0;
  }

  weekNum++;
  const offset = s.paschaOffset >= 0 ? '+' + s.paschaOffset : s.paschaOffset;
  const offsetStr = offset.toString().padStart(4);

  // Determine week number for post-pentecost
  let weekLabel = '';
  if (s.category === 'post-pentecost') {
    const match = s.name.match(/(\d+)/);
    if (match) weekLabel = 'D' + match[1].padStart(2, '0');
  } else if (s.category === 'lent') {
    weekLabel = 'L' + weekNum.toString().padStart(2, '0');
  }

  console.log('│ ' + s.date + ' │ ' + offsetStr + ' │ ' + weekLabel.padEnd(4) + '│ ' + s.name.substring(0, 50).padEnd(50) + '│');
});

console.log('└─────────────────────────────────────────────────────────────────────────────┘');
console.log('');
console.log('Total Sundays:', cal.sundays.length);
