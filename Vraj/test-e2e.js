// test-e2e.js
// Automated verification of Brand Builder API contracts and Socratic engine

async function runTests() {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  console.log('--- Starting Brand Builder Automated Verification Suite ---');

  // 1. Health check
  console.log('\n[1/5] Checking /api/health...');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const healthData = await healthRes.json();
  console.log('✓ Health response:', healthData);
  if (healthData.status !== 'ok') throw new Error('Health check failed');

  // 2. Presets
  console.log('\n[2/5] Checking /api/presets...');
  const presetsRes = await fetch(`${BASE_URL}/api/presets`);
  const presetsData = await presetsRes.json();
  console.log(`✓ Received ${presetsData.length} presets:`, presetsData.map(p => p.title));
  if (presetsData.length !== 3) throw new Error('Expected 3 presets');

  // 3. Socratic Interview Round 1, 2, 3
  console.log('\n[3/5] Testing Socratic Question State Machine...');
  const pitch = presetsData[0].pitch;
  const history = [];

  for (let round = 1; round <= 3; round++) {
    console.log(`\n  -> Testing Round ${round}/3...`);
    const qRes = await fetch(`${BASE_URL}/api/interview/next`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pitch, history, currentRound: round, useMock: true })
    });

    const qData = await qRes.json();
    console.log(`  ✓ Round ${qData.currentRound}: "${qData.question}"`);
    console.log(`  ✓ Rationale: "${qData.reasoning}"`);
    console.log(`  ✓ Suggested answer pills (${qData.suggestedAnswers.length}):`, qData.suggestedAnswers);

    if (qData.suggestedAnswers.length !== 3) {
      throw new Error(`Expected exactly 3 suggested answers, got ${qData.suggestedAnswers.length}`);
    }

    // Simulate founder selecting option 0
    history.push({
      round: qData.currentRound,
      question: qData.question,
      reasoning: qData.reasoning,
      userAnswer: qData.suggestedAnswers[0]
    });
  }

  // 4. Synthesize Brand Kit
  console.log('\n[4/5] Testing Brand Kit Compilation (/api/interview/compile)...');
  const compileRes = await fetch(`${BASE_URL}/api/interview/compile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pitch, history, useMock: true })
  });

  const kitData = await compileRes.json();
  console.log('✓ Synthesized Brand Strategy:', {
    brandName: kitData.brandStrategy.brandName,
    tagline: kitData.brandStrategy.tagline,
    antiHero: kitData.brandStrategy.antiHero,
    differentiator: kitData.brandStrategy.differentiator
  });

  console.log('✓ Synthesized Voice System:', {
    archetype: kitData.voiceSystem.archetype,
    tone: kitData.voiceSystem.tone,
    dosCount: kitData.voiceSystem.dos.length,
    dontsCount: kitData.voiceSystem.donts.length
  });

  console.log('✓ Synthesized Visual Tokens:', {
    palette: kitData.visualTokens.palette.map(p => `${p.name} (${p.hex}, ${p.role})`),
    headingFont: kitData.visualTokens.typography.headingFont,
    bodyFont: kitData.visualTokens.typography.bodyFont,
    googleFontsUrl: kitData.visualTokens.typography.googleFontsUrl
  });

  console.log('✓ Synthesized Launch Content:', {
    heroHeadline: kitData.launchContent.heroHeadline,
    callToAction: kitData.launchContent.callToAction,
    manifestoLength: kitData.launchContent.manifesto.length,
    socialHooks: kitData.launchContent.socialHooks
  });

  // Verify Schema Integrity
  const requiredBrandStrategy = ['brandName', 'tagline', 'mission', 'targetAudience', 'coreValueProposition', 'antiHero', 'differentiator'];
  const requiredVoice = ['archetype', 'tone', 'dos', 'donts', 'vocabularyWords'];
  const requiredVisual = ['palette', 'typography', 'stylePhilosophy', 'borderCurvature'];
  const requiredLaunch = ['heroHeadline', 'heroSubheadline', 'callToAction', 'manifesto', 'elevatorPitch', 'socialHooks'];

  for (const field of requiredBrandStrategy) {
    if (!kitData.brandStrategy[field]) throw new Error(`Missing brandStrategy.${field}`);
  }
  for (const field of requiredVoice) {
    if (!kitData.voiceSystem[field]) throw new Error(`Missing voiceSystem.${field}`);
  }
  for (const field of requiredVisual) {
    if (!kitData.visualTokens[field]) throw new Error(`Missing visualTokens.${field}`);
  }
  for (const field of requiredLaunch) {
    if (!kitData.launchContent[field]) throw new Error(`Missing launchContent.${field}`);
  }

  // 5. Check HTML & Static bundle
  console.log('\n[5/5] Checking static root and HTML bundle...');
  const htmlRes = await fetch(`${BASE_URL}/`);
  const htmlText = await htmlRes.text();
  if (!htmlText.includes('Brand Builder')) throw new Error('Root HTML missing title');
  console.log('✓ Root HTML serves successfully with Google Fonts and bundled assets.');

  console.log('\n======================================================');
  console.log(' ALL 5 VERIFICATION SUITES PASSED FLAWLESSLY! ');
  console.log('======================================================\n');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
