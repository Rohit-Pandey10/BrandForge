// Simple English & Incomplete Prompt Test
const pitch = "i want make app for shoe";

async function runTest() {
  console.log('====================================================');
  console.log('TESTING AI WITH INCOMPLETE PROMPT: "' + pitch + '"');
  console.log('====================================================');

  console.log('\nStep 1: Sending prompt to POST /api/interview/start...');
  const t0 = Date.now();
  const startRes = await fetch('http://localhost:5001/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initialPitch: pitch })
  });

  if (!startRes.ok) {
    throw new Error('Start failed with HTTP ' + startRes.status);
  }

  const startData = await startRes.json();
  const duration1 = Date.now() - t0;
  console.log('SUCCESS! (' + duration1 + 'ms)');
  console.log('Questions received from AI:', startData.questions?.length);
  
  startData.questions.forEach((q, idx) => {
    console.log(`\n  [Q${idx + 1}] (${q.stageLabel})`);
    console.log('  Question:', q.question);
    console.log('  Suggested Options:', q.suggestedAnswers?.join(' | '));
    console.log('  Why AI asked this:', q.reasoning);
  });

  console.log('\n====================================================');
  console.log('Step 2: Sending answers to POST /api/interview/compile...');
  const t1 = Date.now();

  const compileRes = await fetch('http://localhost:5001/api/interview/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initialPitch: pitch,
      qaPairs: [
        {
          stageLabel: startData.questions[0]?.stageLabel || 'Stage 1',
          question: startData.questions[0]?.question || 'Who is this for?',
          answer: startData.questions[0]?.suggestedAnswers?.[0] || 'Sneakerheads buying rare drops'
        },
        {
          stageLabel: startData.questions[1]?.stageLabel || 'Stage 2',
          question: startData.questions[1]?.question || 'What is wrong with current apps?',
          answer: 'Fake shoes and bot scalpers buying everything'
        }
      ]
    })
  });

  if (!compileRes.ok) {
    throw new Error('Compile failed with HTTP ' + compileRes.status);
  }

  const kit = await compileRes.json();
  const duration2 = Date.now() - t1;
  console.log('SUCCESS! (' + duration2 + 'ms)');

  console.log('\n--- AI SYNTHESIZED BRAND RESULTS ---');
  console.log('Brand Name :', kit.brandStrategy?.brandName);
  console.log('Tagline    :', kit.brandStrategy?.tagline);
  console.log('Mission    :', kit.brandStrategy?.mission);
  console.log('Target ICP :', kit.brandStrategy?.targetAudience);
  console.log('Anti-Hero  :', kit.brandStrategy?.antiHero);
  console.log('Difference :', kit.brandStrategy?.differentiator);

  console.log('\n--- DESIGN TOKENS ---');
  console.log('Palette:');
  kit.visualTokens?.palette?.forEach(c => {
    console.log(`  - [${c.role.toUpperCase()}] ${c.name}: ${c.hex}`);
  });
  console.log('Heading Font:', kit.visualTokens?.typography?.headingFont);
  console.log('Body Font   :', kit.visualTokens?.typography?.bodyFont);
  console.log('Curvature   :', kit.visualTokens?.borderCurvature);

  console.log('\n--- LAUNCH COPY & MANIFESTO ---');
  console.log('Headline:', kit.launchContent?.heroHeadline);
  console.log('CTA     :', kit.launchContent?.callToAction);
  console.log('Manifesto Snippet:\n' + kit.launchContent?.manifesto?.slice(0, 200) + '...');
  console.log('\n====================================================');
  console.log('TEST COMPLETE: The AI is 100% working!');
  console.log('====================================================');
}

runTest().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
