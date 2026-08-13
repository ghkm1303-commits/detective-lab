const fs = require('fs');

try {
  const data = JSON.parse(fs.readFileSync('src/data/drugs.json', 'utf8'));
  console.log('✅ JSON is VALID!');
  console.log(`📊 Total drugs: ${data.drugs.length}`);
} catch (error) {
  console.error('❌ JSON ERROR:', error.message);
  console.error('Line info:', error);
}