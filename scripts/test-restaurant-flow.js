/**
 * Automated Verification Script: Tests restaurant & hospitality branding pipeline
 */
async function runVerification() {
  console.log('🧪 Starting Restaurant Brand Pipeline Verification...\n');

  const pitch = "I want to make a cozy wood-fired pizza and natural wine restaurant";
  
  // Test 1: Interview Question
  console.log(`[1] Testing POST /api/interview/next with pitch: "${pitch}"...`);
  const nextRes = await fetch('http://localhost:5001/api/interview/next', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history: [{ role: 'user', content: pitch }]
    })
  });

  if (!nextRes.ok) {
    throw new Error(`POST /api/interview/next failed with status ${nextRes.status}`);
  }

  const nextData = await nextRes.json();
  console.log('Question received:', nextData.question);
  console.log('Suggested answers:', nextData.suggestedAnswers);
  console.log('Stage label:', nextData.stageLabel);
  console.log('Reasoning:', nextData.reasoning);

  // Assertions on Question
  const forbiddenBuzzwords = [
    'terroir', 'provenance', 'quiet luxury', 'unfiltered exposure',
    'sovereign', 'climate-controlled indifference', 'elemental',
    'sanctuary', 'sacred cow', 'bleeding-neck', 'synergize'
  ];

  const questionLower = (nextData.question || '').toLowerCase();
  for (const word of forbiddenBuzzwords) {
    if (questionLower.includes(word)) {
      throw new Error(`FAILED: Question contains forbidden buzzword "${word}"`);
    }
  }

  if (!nextData.suggestedAnswers || nextData.suggestedAnswers.length !== 3) {
    throw new Error(`FAILED: Expected exactly 3 suggested answers, got ${nextData.suggestedAnswers?.length}`);
  }

  for (const ans of nextData.suggestedAnswers) {
    const wordCount = ans.trim().split(/\s+/).length;
    if (wordCount > 6) {
      console.warn(`WARNING: Suggested answer has ${wordCount} words (> 6): "${ans}"`);
    }
  }
  console.log('✅ Question test PASSED!\n');

  // Test 2: Synthesis
  console.log('[2] Testing POST /api/interview/compile with restaurant conversation history...');
  const compileRes = await fetch('http://localhost:5001/api/interview/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      history: [
        { role: 'user', content: pitch },
        { role: 'assistant', content: nextData.question },
        { role: 'user', content: nextData.suggestedAnswers[0] }
      ]
    })
  });

  if (!compileRes.ok) {
    throw new Error(`POST /api/interview/compile failed with status ${compileRes.status}`);
  }

  const brandKit = await compileRes.json();
  console.log('Brand Name:', brandKit.brandStrategy.brandName);
  console.log('Tagline:', brandKit.brandStrategy.tagline);
  console.log('Hero Headline:', brandKit.launchContent.heroHeadline);
  console.log('Voice Archetype:', brandKit.voiceSystem.archetype);
  console.log('Typography Rationale:', brandKit.visualTokens.typography.rationale);
  console.log('Palette:', brandKit.visualTokens.palette.map(p => `${p.name} (${p.hex})`).join(', '));

  // Assertions on Synthesis
  const fullText = JSON.stringify(brandKit).toLowerCase();
  for (const word of ['system labels', 'high data density', 'data density', 'beachhead icp']) {
    if (fullText.includes(word)) {
      throw new Error(`FAILED: Brand kit contains forbidden tech term "${word}"`);
    }
  }

  console.log('\n✅ All Restaurant Brand Pipeline tests PASSED successfully!');
}

runVerification().catch(err => {
  console.error('\n❌ Verification FAILED:', err.message);
  process.exit(1);
});
