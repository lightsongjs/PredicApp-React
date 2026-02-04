import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('complete-sermon-library.json', 'utf8'));

const issues = [];

const romanMap = {
  'I':1,'II':2,'III':3,'IV':4,'V':5,'VI':6,'VII':7,'VIII':8,'IX':9,'X':10,
  'XI':11,'XII':12,'XIII':13,'XIV':14,'XV':15,'XVI':16,'XVII':17,'XVIII':18,'XIX':19,'XX':20,
  'XXI':21,'XXII':22,'XXIII':23,'XXIV':24,'XXV':25,'XXVI':26,'XXVII':27,'XXVIII':28,'XXIX':29,
  'XXX':30,'XXXI':31,'XXXII':32,'XXXIII':33,'XXXIV':34,'XXXV':35
};

function checkSermons(sermons) {
  for (const s of sermons) {
    const title = s.title || '';
    const audio = s.audioFile || '';

    // Check for Vameșului in title but not matching Duminica 33
    if (title.includes('Vameșului') && !audio.includes('33') && !title.includes('33')) {
      issues.push('Vameșului without 33: ' + title.substring(0, 80));
    }

    // Check for Fiului Risipitor (should be Duminica 34)
    if (title.includes('Risipitor') && !audio.includes('fiului risipitor') && !audio.includes('34')) {
      if (!title.includes('34') && title.includes('Duminica')) {
        issues.push('Risipitor mismatch: ' + title.substring(0, 80));
      }
    }

    // Check for Lăsatului sec de brânză (Forgiveness Sunday, before Lent)
    if (title.includes('Lăsatului') && title.includes('brânză')) {
      // This should be the last Sunday before Lent
    }

    // Check if title has a Roman numeral that doesn't match audio file number
    const titleMatch = title.match(/Duminica a ([IVXL]+)-a/i);
    const audioMatch = audio.match(/Duminica (\d+)/);

    if (titleMatch && audioMatch) {
      const titleRoman = titleMatch[1].toUpperCase();
      const titleNum = romanMap[titleRoman] || 0;
      const audioNum = parseInt(audioMatch[1]);

      if (titleNum && audioNum && titleNum !== audioNum) {
        issues.push(`Number mismatch (title:${titleNum} vs audio:${audioNum}): ${title.substring(0, 60)}`);
      }
    }
  }
}

// Check all categories
for (const [key, cat] of Object.entries(data.categories || {})) {
  if (cat.sermons) {
    checkSermons(cat.sermons);
  }
}

console.log('=== POTENTIAL MAPPING ISSUES ===\n');
if (issues.length === 0) {
  console.log('No issues found!');
} else {
  issues.forEach(i => console.log('- ' + i));
  console.log('\nTotal issues found:', issues.length);
}
