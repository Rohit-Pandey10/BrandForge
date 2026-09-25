// Test Intent Router with CHAT vs PITCH inputs
async function testIntent() {
  console.log('Testing CHAT 1: "Hello"');
  const chat1 = await fetch('http://localhost:5001/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initialPitch: 'Hello' })
  }).then(r => r.json());
  console.log('Result 1:', chat1);

  console.log('\nTesting CHAT 2: "Why isn\'t this working?"');
  const chat2 = await fetch('http://localhost:5001/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initialPitch: "Why isn't this working?" })
  }).then(r => r.json());
  console.log('Result 2:', chat2);

  console.log('\nTesting PITCH: "I am creating a wood-fired sourdough pizza spot"');
  const pitch = await fetch('http://localhost:5001/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initialPitch: 'I am creating a wood-fired sourdough pizza spot' })
  }).then(r => r.json());
  console.log('Result 3 -> Type:', pitch.type, '| Questions count:', pitch.questions?.length);
}

testIntent().catch(console.error);
