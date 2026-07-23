import axios from 'axios';

async function testApi() {
  try {
    console.log('Sending search request for city: Mumbai...');
    const res = await axios.post('http://localhost:5000/api/search', { city: 'Mumbai' });
    console.log('✅ API Response Status:', res.status);
    console.log('✅ Total Leads Discovered:', res.data.totalCount);
    console.log('✅ Queries Executed:', res.data.queriesExecuted);
    console.log('\n--- SAMPLE LEAD RECORD ---');
    console.log(JSON.stringify(res.data.leads[0], null, 2));

    console.log('\nTesting Excel Export endpoint...');
    const exportRes = await axios.post('http://localhost:5000/api/export', {
      leads: res.data.leads,
      city: 'Mumbai'
    }, { responseType: 'arraybuffer' });
    console.log('✅ Excel Export Status:', exportRes.status, 'Buffer length:', exportRes.data.byteLength, 'bytes');

  } catch (err) {
    console.error('❌ API Test error:', err.message);
  }
}

testApi();
