export const SAMPLE_BRAND_KIT = {
  _id: "sample_blister_and_beam_01",
  domain: "food_hospitality",
  brandStrategy: {
    brandName: "Blister & Beam",
    tagline: "Wood-fired sourdough. Zero pretense.",
    mission: "To strip away the sterile white-tablecloth snobbery of fine dining and serve uncompromised, naturally leavened wood-fired pies at communal tables where everyone has a seat.",
    targetAudience: "Discerning urban food lovers and neighborhood regulars who crave exceptional fermented crusts without reservation waitlists or sterile dining rooms.",
    coreValueProposition: "Oversized triangular sourdough wedges blistered over seasoned oak, served at broad communal tables with chilled house tea and radical hospitality.",
    antiHero: "The Snobby Slice: square-cut $40 tasting-menu pizza served on cold porcelain by aloof waiters where you eat in silence.",
    differentiator: "The only wood-fired pizza house pairing 72-hour wild fermentation with generous communal bench seating, affordable pricing, and zero reservations."
  },
  voiceSystem: {
    archetype: "The Warm Iconoclast",
    tone: ["Grounded", "Sensory", "Unhurried", "Direct"],
    dos: [
      "Describe physical baking craft: blistered crusts, oak embers, tangy fermentation",
      "Invite conversation: speak like a welcoming host at the end of a long wooden bench",
      "Celebrate generous portions and accessible neighborhood dining"
    ],
    donts: [
      "Never use culinary elitism (BANNED: 'artisanal curation', 'bespoke gastronomy', 'epicurean')",
      "Never sound clinical, corporate, or overly polished",
      "Never apologize for flour on the table or charred crust bubbles"
    ],
    vocabularyWords: ["Blistered", "Hearth", "Oak-fired", "Leaven", "Tangy", "Communal", "Wedges"]
  },
  visualTokens: {
    borderCurvature: "rounded-2xl",
    stylePhilosophy: "Handhold Editorial Warm Craft",
    typography: {
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
    },
    palette: [
      { name: "Charred Brick", hex: "#8D3B2F", role: "primary" },
      { name: "Toasted Sourdough", hex: "#E8D5B5", role: "secondary" },
      { name: "Iced Tea Amber", hex: "#D4A373", role: "accent" },
      { name: "Reclaimed Wood Cream", hex: "#F5F2EB", role: "surface" },
      { name: "Blackened Crust", hex: "#28211A", role: "text" }
    ]
  },
  swotAnalysis: {
    summary: "Blister & Beam captures high customer velocity by rejecting fine-dining pretension in favor of high-turnover communal dining, maintaining defensibility through proprietary 72-hour wild fermentation.",
    strengths: [
      {
        title: "Distinct Fermentation Moat",
        analysis: "Proprietary 72-hour cold sourdough fermentation yields signature charred blistering that commercial gas ovens cannot replicate.",
        transcriptAnchor: "Wood-fired sourdough. Zero pretense."
      },
      {
        title: "High-Density Table Turnover",
        analysis: "Broad communal benches maximize seating capacity and eliminate empty reservation slots during peak hours.",
        transcriptAnchor: "Big Wedges. Big Tables. Zero Intimidation."
      }
    ],
    weaknesses: [
      {
        title: "Wood & Temperature Volatility",
        analysis: "True hardwood oak ovens require manual heat calibration and skilled pizzaiolos, leading to higher initial kitchen training overhead.",
        mitigation: "Establish dedicated apprentice rotation and standardized hardwood moisture testing protocols."
      },
      {
        title: "No-Reservation Waiting Friction",
        analysis: "Walk-in only policies can lead to bottleneck crowding at the door during weekend peak hours.",
        mitigation: "Offer complimentary iced tea and outdoor bench seating to turn waiting into a communal social ritual."
      }
    ],
    opportunities: [
      {
        title: "Late-Night Wedge Window",
        analysis: "Repurpose leftover daily dough batches for post-10 PM walk-up slices at a premium single-cut margin.",
        growthVector: "Walk-up sidewalk hatch for evening neighborhood foot traffic."
      },
      {
        title: "Take-Home Sourdough Starter & Flour Packs",
        analysis: "Monetize brand fandom by retailing branded dry flour blends and wild yeast crocks.",
        growthVector: "Direct-to-consumer retail merchandise shelf at the host stand."
      }
    ],
    threats: [
      {
        title: "Fast-Casual Neapolitan Clones",
        analysis: "Aggressive regional conveyor-belt pizza chains attempting to imitate wood-fired aesthetic with gas ovens.",
        defense: "Display raw stacked seasoned oak cordwood openly in the dining room and publish live oven temperature logs."
      },
      {
        title: "Local Hardwood Price Spikes",
        analysis: "Supply fluctuations in seasoned fruitwood and dense oak cords threatening baking margin consistency.",
        defense: "Lock annual multi-year supply contracts directly with regional timber management collectives."
      }
    ]
  },
  websiteBlueprint: {
    badge: "HOSPITALITY PREVIEW",
    heroLayout: "centered_minimal",
    announcementBar: "Now serving: The 'Brick & Tart' Seasonal Wedge · Open Daily from 5pm",
    primaryCta: "View Menu",
    secondaryCta: "Private Dining",
    sections: [
      {
        type: "catalog_grid",
        title: "THE ROTATING WEDGES",
        subtitle: "10-15 core pies, always charred, always tangy.",
        items: [
          {
            label: "The Founders' Wedge",
            description: "Our signature. San Marzano tomatoes, fresh mozzarella, and a crust blistered to a deep mahogany. The tang of the sourdough cuts through the richness.",
            metricOrPrice: "$9.50",
            tag: "SIGNATURE"
          },
          {
            label: "Brick & Basil",
            description: "Garlic-infused olive oil, fresh basil, and a light drizzle of chili oil. Served with a side of high-quality iced tea on the house for first-timers.",
            metricOrPrice: "$10.00",
            tag: "NEW BATCH"
          },
          {
            label: "The Gathering Box",
            description: "A curated selection of 6 wedges from the current rotating menu. Designed for tables of 4+, includes 4 cups of house-brewed iced tea.",
            metricOrPrice: "$42.00",
            tag: "GROUP FAVORITE"
          }
        ]
      },
      {
        type: "comparative_ledger",
        title: "WHY BLISTER & BEAM?",
        subtitle: "We reject the 'Snobby Slice' standard.",
        items: [
          {
            label: "BLISTER & BEAM",
            description: "The Blister & Beam Experience: Oversized triangular wedges, reclaimed wood tables, accessible pricing, and brief, friendly check-ins. You're eating together, on your own terms.",
            tag: "The Blister & Beam Experience"
          },
          {
            label: "THE INDUSTRY DEFAULT",
            description: "The Snobby Slice: Square cuts, white porcelain, $40 wine list, and a waiter who won't leave you alone. You're eating alone, even if you're with friends.",
            tag: "The Snobby Slice"
          }
        ]
      }
    ]
  },
  launchContent: {
    heroHeadline: "Big Wedges. Big Tables. Zero Intimidation.",
    heroSubheadline: "Charred, blistered sourdough slices at accessible prices. Come for the tang, stay for the gathering.",
    callToAction: "View Menu",
    manifesto: "We believe good bread should bring people together, not keep them quiet. That pizza shouldn't require a white tablecloth, a sommelier, or a month-long waiting list.\n\nAt Blister & Beam, we feed people on our terms: giant slices, charred and blistered over seasoned oak, served at long wooden benches where you might bump elbows with a stranger. It's hot, it's messy, and it's real.",
    elevatorPitch: "Blister & Beam is a neighborhood wood-fired sourdough pizza house serving oversized charred wedges and house iced tea at communal reclaimed wood tables.",
    socialHooks: [
      "No tweezers. No tablecloths. Just 72-hour sourdough blistered over hardwood oak. Big tables open at 5.",
      "The crust has blisters because the oven is 900 degrees. The tables are long because pizza is meant to be shared.",
      "If your pizza isn't a little charred and tangy, you're just eating warm cheese toast."
    ]
  }
};

export default SAMPLE_BRAND_KIT;
