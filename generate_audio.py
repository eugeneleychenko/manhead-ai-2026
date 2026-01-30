#!/usr/bin/env python3
"""
Generate individual MP3 files for each slide using ElevenLabs API
"""

import requests
import json
import time

# ElevenLabs Configuration
API_KEY = "sk_169fb153ea94ea003d7ec388615cdcad7f084c7592d772e2"
VOICE_ID = "41r4aLCZsFMNZdz2qXUq"
API_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

# Voice settings optimized for executive briefing
VOICE_SETTINGS = {
    "stability": 0.5,  # Moderate stability for natural variance
    "similarity_boost": 0.75,  # High similarity to maintain consistency
    "style": 0.0,  # Neutral style
    "use_speaker_boost": True
}

# Slide narrations (cleaned text without markdown formatting)
SLIDE_NARRATIONS = {
    1: "Steve, this is our AI implementation roadmap for Manhead. Built on ten years of working inside your systems, understanding what works, what doesn't, and where the real opportunities are.",

    2: "Let's start with the bottom line. Manhead is ready for AI. You've already got working AI in production—shipping slip automation is running right now. Your systems infrastructure is solid. And you've got clear opportunities. The question isn't whether to invest in AI. It's how to do it without wasting money on tools that can't deliver because the foundation isn't there.",

    3: "Before we talk about what's next, let's acknowledge what's already running. Merch Wizard—your creative workflow platform—is live and actively used by the design team. Mission Control pulls touring data from Atvenu and e-commerce from Shopify, organized by band. It exists, it just needs a relaunch. And shipping slip automation? That's AI-powered data entry working in production today. You're not starting from zero. You're building on a foundation that most companies don't have.",

    4: "Here's the goal: you want to ask 'How did Band X perform at the transaction level across their last tour?' and get an answer in thirty seconds. That's entirely achievable. But here's the reality. That question requires pulling transaction-level data from Atvenu, which currently doesn't have a proper read-write API integration. The data exists—it's just not accessible in a way AI can reliably query. This is why most AI roadmaps fail. They start with chatbots and dynamic pricing and skip the plumbing. The good news? The plumbing work isn't massive. It's targeted gap-filling, not a rebuild.",

    5: "Let's talk about quick wins—things we can deliver in sixty to ninety days. First: AI mockup generation in Merch Wizard. Automatically superimpose approved designs onto different shirt styles and colors. Saves hours per project. Second: Mission Control relaunch. Updated dashboards, training for leadership. The tool already exists—we're activating it. Third: Design team AI training. Get the creative team fluent in Midjourney, DALL-E, AI-assisted ideation. Immediate productivity lift. Fourth—and this is the big one: Royalty email parsing automation. Automate ingestion of sales reports from Zumiez, Spencer's, and other retail partners. This alone saves forty-plus hours per quarter.",

    6: "Let's talk ROI. The royalty email parsing is measurable—forty-plus hours per quarter back to your accounting team. Real time savings. The other quick wins deliver qualitative value: faster mockup turnaround, better leadership visibility, more creative experimentation. But the foundation work—data infrastructure, Atvenu integration—that's where the bigger ROI lives. It unlocks everything in the full menu: automated settlements, AI forecasting, transaction-level analytics.",

    7: "Here's my recommendation: start with quick wins plus foundation work in parallel. You get momentum and visible progress while building toward bigger capabilities. This isn't sequential—these are parallel tracks. Build the foundation while delivering immediate wins. That's how you avoid the trap of flashy tools that don't work.",

    8: "If this direction makes sense, here's what happens next. We schedule a discovery call to talk through priorities and scope. Then we move to project-based engagement—each item is a discrete deliverable with clear outcomes. No long-term commitments required. First projects would likely be the quick wins plus initial data infrastructure work.",

    9: "You've already been thinking about this: order management, settlement automation, personalization, dynamic pricing. These are the right categories. The challenge is getting there without building on shaky foundations.",

    10: "Here's your current systems landscape: NetSuite for accounting, Monday for project tracking, ShipHero for fulfillment, Atvenu for touring, Shopify for approximately one-fifty artist stores, and HubSpot for CRM.",

    11: "And here's the custom infrastructure already in place: Merch Wizard managing creative workflows, Mission Control pulling financial data, integrations between NetSuite and Monday, Atvenu and ShipHero, and that shipping slip automation running in production.",

    12: "Then there's the Royalty Calculator—a Google Sheet that's been in use for over a decade. It works, but it's fragile, requires manual intervention, and takes forty-plus hours per quarter to maintain. It wasn't designed for the scale Manhead operates at today.",

    13: "AI is only as good as the data it can access. When you ask 'How did this band perform at the transaction level?'—that should be a thirty-second answer. But without proper API integrations, the data exists but isn't accessible.",

    14: "Without solid infrastructure, AI tools hallucinate answers because they can't access real data. Integrations break. Teams lose trust in the technology. You spend money on tools that can't deliver.",

    15: "The path forward: systems need reliable bi-directional integrations. Data needs to be structured and trustworthy. Manual processes need automated ingestion. This isn't about delaying the good stuff—quick wins and foundation work happen in parallel.",

    16: "Before building new, maximize what exists. Mission Control consolidates data and could be re-launched with enhanced capabilities. Merch Wizard is actively used and ready for AI enhancements. Shipping slip automation proves AI works at Manhead.",

    17: "Two options: Option A—quick wins plus foundation work in parallel. This gives you visible progress while setting up for bigger capabilities. Option B—start with discovery engagements if we need more visibility into specific departments before prescribing solutions.",

    18: "Here's how we work: project-based, discrete deliverables, no long-term commitments. Clear scope and outcomes. Realistic timelines. We tell you what's actually achievable, not what sounds good.",

    19: "Now for the full menu. Everything below is modular—pick what makes sense for your priorities. The Executive Summary recommends where to start. This is the complete catalog.",

    20: "Category A: Foundational Work. Data infrastructure and integration services—API integrations across all your systems, data pipelines, automated ingestion. This is the plumbing that makes AI work.",

    21: "Also in Category A: Royalty Calculator rebuild—replace the Google Sheet with a purpose-built app. And AI-powered order management to replace spreadsheet-based tracking with centralized, intelligent systems.",

    22: "Category B: Enhancements to existing systems. Merch Wizard AI features—automated mockup generation, AI-assisted briefs, tour history intelligence. Get more value from what's already built.",

    23: "More Category B: Mission Control relaunch and expansion—stakeholder training, updated dashboards, forecasting, AI-powered insights. Plus digital asset management with automatic tagging and natural language search.",

    24: "Category C: Touring and Settlement. Automate post-show financial processes—settlement reports, reconciliation, revenue shares, artist payouts. Plus touring analytics with transaction-level visibility and real-time dashboards during tours.",

    25: "Category D: E-Commerce and Fan Experience. Personalized storefronts with dynamic recommendations and automated email campaigns. AI-powered customer support chatbot for order inquiries, tour dates, returns—handles routine, humans handle complex.",

    26: "More Category D plus Category E: Dynamic pricing intelligence—machine learning models to optimize pricing based on demand, inventory, geography. And generative AI for merch design—Midjourney, DALL-E integrated into your creative workflow.",

    27: "Categories F and G: AI-powered financial forecasting—revenue projections, tour scenario modeling, cash flow prediction. Plus supply chain optimization—shipping routes, vendor selection, freight cost optimization, stockout prevention.",

    28: "More operations: Inventory demand forecasting by SKU and artist. Licensing opportunity engine to scan retail trends and marketplace gaps. Contract and legal automation to draft, review, and analyze agreements.",

    29: "Category J: Discovery Engagements. For areas needing exploration before solutions—Operations, Retail, Licensing, Sales discovery, plus HubSpot audit. These ensure we're solving real problems, not imagined ones.",

    30: "Steve, when you're ready, let's talk through priorities and build a roadmap that makes sense for Manhead. This is about doing AI right—foundation plus wins, no wasted effort."
}


def generate_audio_for_slide(slide_num, text, output_dir="."):
    """Generate MP3 audio for a single slide using ElevenLabs API"""

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": API_KEY
    }

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": VOICE_SETTINGS
    }

    print(f"Generating audio for Slide {slide_num}...")

    try:
        response = requests.post(API_URL, json=data, headers=headers)

        if response.status_code == 200:
            filename = f"{output_dir}/slide_{slide_num:02d}.mp3"
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"✓ Saved: {filename}")
            return True
        else:
            print(f"✗ Error for Slide {slide_num}: {response.status_code}")
            print(f"  Response: {response.text}")
            return False

    except Exception as e:
        print(f"✗ Exception for Slide {slide_num}: {str(e)}")
        return False


def main():
    """Generate all slide audio files"""
    print("=" * 60)
    print("ElevenLabs Audio Generation for Manhead AI Presentation")
    print("=" * 60)
    print(f"Voice ID: {VOICE_ID}")
    print(f"Total Slides: {len(SLIDE_NARRATIONS)}")
    print("=" * 60)
    print()

    output_dir = "."
    success_count = 0
    failed_slides = []

    for slide_num in range(1, 31):
        text = SLIDE_NARRATIONS[slide_num]

        if generate_audio_for_slide(slide_num, text, output_dir):
            success_count += 1
        else:
            failed_slides.append(slide_num)

        # Rate limiting: ElevenLabs has limits, add a small delay
        if slide_num < 30:
            time.sleep(0.5)

    print()
    print("=" * 60)
    print("GENERATION COMPLETE")
    print("=" * 60)
    print(f"Successful: {success_count}/30")

    if failed_slides:
        print(f"Failed slides: {failed_slides}")
    else:
        print("All slides generated successfully!")

    print()
    print("Next step: Run the update script to integrate audio into presentation.html")


if __name__ == "__main__":
    main()
