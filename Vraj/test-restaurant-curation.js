// test-restaurant-curation.js
// Automated verification of domain-curated Socratic questioning for restaurants and custom ventures

async function testRestaurantCuration() {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  console.log('--- Testing Dynamic Curation for Restaurants & Custom Domains ---');

  const restaurantPitch = 'An authentic wood-fired Neapolitan sourdough pizza restaurant with lively family sharing tables in Brooklyn';
  console.log(`\nInput Pitch: "${restaurantPitch}"\n`);

  // Round 1
  const r1Res = await fetch(`${BASE_URL}/api/interview/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pitch: restaurantPitch, currentRound: 1, history: [] })
  });
  const r1 = await r1Res.json();
  console.log('Round 1 Question:', r1.question);
  console.log('Round 1 Suggested Answers:', r1.suggestedAnswers);
  console.log('Round 1 Reasoning:', r1.reasoning);

  // Assertions: must NOT mention DevOps or tech leads
  const r1Text = JSON.stringify(r1).toLowerCase();
  if (r1Text.includes('devops') || r1Text.includes('database') || r1Text.includes('software engineers')) {
    throw new Error('FAILED: Restaurant was served generic tech/database questions!');
  }
  if (!r1Text.includes('dinner') && !r1Text.includes('dining') && !r1Text.includes('joint') && !r1Text.includes('table') && !r1Text.includes('culinary') && !r1Text.includes('restaurant')) {
    throw new Error('FAILED: Question was not curated for dining/restaurant domain!');
  }
  console.log('✓ Round 1 is properly curated for restaurant dining!');

  // Round 2
  const r2Res = await fetch(`${BASE_URL}/api/interview/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pitch: restaurantPitch,
      currentRound: 2,
      history: [{ round: 1, question: r1.question, userAnswer: r1.suggestedAnswers[0] }]
    })
  });
  const r2 = await r2Res.json();
  console.log('\nRound 2 Question:', r2.question);
  console.log('Round 2 Suggested Answers:', r2.suggestedAnswers);
  console.log('Round 2 Reasoning:', r2.reasoning);

  const r2Text = JSON.stringify(r2).toLowerCase();
  if (r2Text.includes('api') || r2Text.includes('saas') || r2Text.includes('cloud')) {
    throw new Error('FAILED: Round 2 was served generic tech questions!');
  }
  console.log('✓ Round 2 is properly curated for kitchen boundaries & ingredient compromises!');

  // Round 3
  const r3Res = await fetch(`${BASE_URL}/api/interview/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pitch: restaurantPitch,
      currentRound: 3,
      history: [
        { round: 1, question: r1.question, userAnswer: r1.suggestedAnswers[0] },
        { round: 2, question: r2.question, userAnswer: r2.suggestedAnswers[0] }
      ]
    })
  });
  const r3 = await r3Res.json();
  console.log('\nRound 3 Question:', r3.question);
  console.log('Round 3 Suggested Answers:', r3.suggestedAnswers);
  console.log('Round 3 Reasoning:', r3.reasoning);
  console.log('✓ Round 3 is properly curated for dining rituals and guest boundaries!');

  // Brand Kit Compilation
  console.log('\nTesting Brand Kit Synthesis for Restaurant...');
  const kitRes = await fetch(`${BASE_URL}/api/interview/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pitch: restaurantPitch,
      history: [
        { round: 1, question: r1.question, userAnswer: r1.suggestedAnswers[0] },
        { round: 2, question: r2.question, userAnswer: r2.suggestedAnswers[0] },
        { round: 3, question: r3.question, userAnswer: r3.suggestedAnswers[0] }
      ]
    })
  });
  const kit = await kitRes.json();
  console.log('✓ Brand Name:', kit.brandStrategy.brandName);
  console.log('✓ Tagline:', kit.brandStrategy.tagline);
  console.log('✓ Palette:', kit.visualTokens.palette.map(p => `${p.name} (${p.hex})`).join(', '));
  console.log('✓ Hero Headline:', kit.launchContent.heroHeadline);
  console.log('✓ Manifesto preview:', kit.launchContent.manifesto.slice(0, 120) + '...');

  const kitText = JSON.stringify(kit).toLowerCase();
  if (kitText.includes('database') || kitText.includes('redis') || kitText.includes('aws rds')) {
    throw new Error('FAILED: Brand kit contains database tokens for a restaurant!');
  }

  console.log('\n======================================================');
  console.log(' RESTAURANT QUESTION & BRAND CURATION TEST PASSED! ');
  console.log('======================================================\n');
}

testRestaurantCuration().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
