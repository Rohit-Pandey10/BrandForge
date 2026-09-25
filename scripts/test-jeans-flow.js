/**
 * Automated Verification Script: Tests jeans & apparel branding pipeline
 */
async function runJeansVerification() {
  console.log('🧪 Starting Denim / Apparel Brand Pipeline Verification...\n');

  const pitch = "I want to launch a raw Japanese selvedge denim jeans brand for young creatives";

  // Test 1: Batch Questions upfront
  console.log(`[1] Testing POST /api/interview/start with pitch: "${pitch}"...`);
  const startRes = await fetch('http://localhost:5001/api/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initialPitch: pitch })
  });

  if (!startRes.ok) {
    throw new Error(`POST /api/interview/start failed with status ${startRes.status}`);
  }

  const startData = await startRes.json();
  const questions = startData.questions;
  console.log(`Received ${questions?.length} discovery questions.`);

  if (!Array.isArray(questions) || questions.length !== 7) {
    throw new Error(`FAILED: Expected exactly 7 questions, got ${questions?.length}`);
  }

  const forbiddenFoodWords = [
    'table', 'tables', 'food', 'dining', 'restaurant', 'plate', 'plates', 'bites',
    'grill', 'grills', 'hearth', 'sourdough', 'chef', 'menu', 'tasty', 'culinary',
    'wine', 'terroir', 'provenance', 'quiet luxury', 'synergize'
  ];

  console.log('\nSample Generated Questions:');
  questions.forEach(q => {
    console.log(`- [${q.stageLabel}] ${q.question}`);
    console.log(`  Options: ${q.suggestedAnswers?.join(' | ')}`);

    const qText = `${q.question} ${(q.suggestedAnswers || []).join(' ')}`.toLowerCase();
    for (const word of forbiddenFoodWords) {
      const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
      if (wordRegex.test(qText)) {
        throw new Error(`FAILED: Question or options contain forbidden word "${word}": "${q.question}"`);
      }
    }
  });

  console.log('✅ Batch Questions test PASSED with 0 food/restaurant contamination!\n');

  // Test 2: Synthesis Compilation
  console.log('[2] Testing POST /api/interview/compile with denim answers...');
  const compileRes = await fetch('http://localhost:5001/api/interview/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initialPitch: pitch,
      answers: {
        "0": "Studio creatives & denim collectors",
        "1": "Synthetic stretch blowout in 6 months",
        "2": "Planned obsolescence & fake laser distressing",
        "3": "Japanese mill minimalism with raw canvas",
        "4": "Heirloom investment ($180–$250)",
        "5": "Hypebeast influencer slang and snobbery",
        "6": "14oz Toyoda shuttle-loom selvedge with lifetime repair"
      }
    })
  });

  if (!compileRes.ok) {
    throw new Error(`POST /api/interview/compile failed with status ${compileRes.status}`);
  }

  const brandKit = await compileRes.json();
  console.log('Synthesized Brand Kit:');
  console.log('Brand Name:', brandKit.brandStrategy?.brandName);
  console.log('Tagline:', brandKit.brandStrategy?.tagline);
  console.log('Hero Headline:', brandKit.launchContent?.heroHeadline);
  console.log('Hero Subheadline:', brandKit.launchContent?.heroSubheadline);
  console.log('Archetype:', brandKit.voiceSystem?.archetype);
  console.log('Manifesto Snippet:', brandKit.launchContent?.manifesto?.slice(0, 150) + '...');

  // Core brand narrative fields must NOT contain culinary or restaurant terms
  const coreCopy = [
    brandKit.brandStrategy?.brandName,
    brandKit.brandStrategy?.tagline,
    brandKit.brandStrategy?.mission,
    brandKit.launchContent?.heroHeadline,
    brandKit.launchContent?.heroSubheadline,
    brandKit.launchContent?.manifesto,
    brandKit.brandStrategy?.coreValueProposition
  ].join(' ').toLowerCase();

  const culinaryTerms = [
    'table', 'dining', 'restaurant', 'plate', 'plates', 'bites',
    'grill', 'grills', 'hearth', 'sourdough', 'chef', 'menu', 'tasty',
    'culinary', 'wine', 'cuisine', 'terroir', 'provenance', 'quiet luxury'
  ];

  for (const word of culinaryTerms) {
    if (coreCopy.includes(` ${word} `) || coreCopy.includes(` ${word}.`) || coreCopy.includes(` ${word},`) || coreCopy.includes(`"${word}"`)) {
      throw new Error(`FAILED: Synthesized Brand Kit narrative contains restaurant/culinary word "${word}"`);
    }
  }

  // Must contain authentic apparel / denim terminology
  const hasApparelTokens = /(denim|selvedge|shuttle|loom|indigo|cotton|cut|wear|workwear|garment|rivet|fade)/i.test(coreCopy);
  if (!hasApparelTokens) {
    throw new Error('FAILED: Synthesized Brand Kit lacks core denim/apparel terminology');
  }

  console.log('\n✅ Denim Brand Kit PASSED with 100% apparel purity and 0 food contamination!');
}

runJeansVerification().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err.message);
  process.exit(1);
});
