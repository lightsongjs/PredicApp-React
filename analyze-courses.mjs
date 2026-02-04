import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('complete-sermon-library.json', 'utf8'));

const courses = data.categories?.courses;
if (courses && courses.sermons) {
  // Group by subcategory (series name)
  const series = {};
  courses.sermons.forEach(s => {
    const key = s.subcategory || 'Other';
    if (!series[key]) series[key] = [];
    series[key].push({ title: s.title, order: s.seriesOrder || 0 });
  });

  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║              COURSE SERIES (Playlists)                           ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  const sorted = Object.entries(series).sort((a, b) => b[1].length - a[1].length);

  sorted.forEach(([name, items]) => {
    console.log(`📚 ${name} (${items.length} parts)`);
    items.sort((a, b) => a.order - b.order).slice(0, 3).forEach((item, i) => {
      console.log(`   ${i + 1}. ${item.title.substring(0, 60)}`);
    });
    if (items.length > 3) console.log(`   ... and ${items.length - 3} more`);
    console.log('');
  });

  console.log('─'.repeat(60));
  console.log(`Total series: ${Object.keys(series).length}`);
  console.log(`Total course sermons: ${courses.sermons.length}`);
}
