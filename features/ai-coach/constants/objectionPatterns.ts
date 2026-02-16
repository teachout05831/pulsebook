import type { ObjectionPattern } from '../types'

export const OBJECTION_PATTERNS: ObjectionPattern[] = [
  // Price objections
  {
    id: 'price_too_high',
    keywords: ['too expensive', 'too much', 'over budget', 'can\'t afford'],
    category: 'price',
    response: 'I understand budget is important. Let me break down exactly what\'s included so you can see the value. Many customers initially feel that way, but they find the quality and reliability actually saves money long-term.',
    alternateResponses: [
      'What budget range were you considering? I may be able to adjust the scope to fit your needs while still delivering great results.',
      'Compared to [competitor alternative], our price includes [key differentiator]. Would it help if I showed you what past customers have said about the value?',
    ],
  },
  {
    id: 'price_comparison',
    keywords: ['cheaper quote', 'lower price', 'better deal', 'other quotes'],
    category: 'price',
    response: 'I appreciate you doing your research. Can I ask what was included in that quote? Often lower prices mean fewer services or lower quality materials. Let me show you exactly what you get with us.',
    alternateResponses: [
      'That\'s smart to compare. The key difference is usually in the details — our quote includes [specific items]. Would you like me to do a side-by-side comparison?',
      'We\'re not always the cheapest, but we consistently deliver the best results. Our reviews speak to that. Would customer testimonials be helpful?',
    ],
  },
  // Timing objections
  {
    id: 'need_time',
    keywords: ['think about it', 'sleep on it', 'get back to you', 'not ready'],
    category: 'timing',
    response: 'Absolutely, take the time you need. What specific concerns would you want to think through? I want to make sure I\'ve addressed everything before we wrap up.',
    alternateResponses: [
      'Of course. To help you make the best decision, what additional information would be most helpful? I can send that over right after our call.',
      'I completely understand. Just so you know, our current availability is [timeframe]. Would it help if I held a spot for you while you decide?',
    ],
  },
  {
    id: 'bad_timing',
    keywords: ['not the right time', 'maybe later', 'next month', 'next year'],
    category: 'timing',
    response: 'I understand timing matters. Is there a specific event or season you\'re waiting for? Sometimes starting the planning process now means we can be ready when the timing is right.',
    alternateResponses: [
      'No problem at all. Would it help if I sent you a detailed proposal you can review at your convenience? That way everything is ready when the time is right.',
      'Totally fair. Many of our customers start with a smaller scope now and expand later. Would a phased approach work for your timeline?',
    ],
  },
  // Competitor objections
  {
    id: 'using_competitor',
    keywords: ['other company', 'already have', 'current provider', 'someone else'],
    category: 'competitor',
    response: 'It\'s great that you\'re exploring options. What made you start looking at alternatives? Understanding what\'s not working can help me show you how we\'d do things differently.',
    alternateResponses: [
      'That makes sense. How has your experience been with them? I\'d love to share how our approach differs, especially when it comes to [key differentiator].',
      'Many of our best customers came to us from other providers. The most common reason was [common pain point]. Does that resonate with your experience?',
    ],
  },
  // Trust objections
  {
    id: 'trust_concern',
    keywords: ['how do I know', 'guarantee', 'what if', 'references'],
    category: 'trust',
    response: 'Great question — I\'d want to know that too. We offer [guarantee/warranty]. I can also connect you with past customers who had similar projects. Would that be helpful?',
    alternateResponses: [
      'We stand behind our work with [specific guarantee]. Plus, you can check our reviews on [platform] — we have [rating] stars from [count] customers.',
      'I completely understand wanting peace of mind. We\'re fully licensed and insured, and we document everything. Would you like to see examples of similar completed projects?',
    ],
  },
  {
    id: 'credibility',
    keywords: ['how long', 'experience', 'qualified', 'licensed', 'insured'],
    category: 'trust',
    response: 'We\'ve been serving this area for [years] years with [credentials]. Our team is fully licensed, insured, and trained. I can share our certifications if that would help.',
    alternateResponses: [
      'Our team has [combined years] of experience. We specialize in exactly this type of project, which means we\'ve seen and solved every challenge that can come up.',
      'We\'re proud of our track record. In fact, [percentage]% of our business comes from referrals and repeat customers. That says a lot about the quality of our work.',
    ],
  },
  // Scope objections
  {
    id: 'scope_concern',
    keywords: ['too much work', 'too big', 'overwhelmed', 'complicated'],
    category: 'scope',
    response: 'I understand it can feel like a big project. The good news is we handle everything — you don\'t have to worry about a thing. We can also break it into phases if that feels more manageable.',
    alternateResponses: [
      'That\'s a common concern, and it\'s exactly why people hire professionals like us. We manage the entire process so you can focus on your day-to-day.',
      'Would a phased approach work better? We could start with the most critical items and tackle the rest over time. That way it\'s less disruptive.',
    ],
  },
  {
    id: 'scope_small',
    keywords: ['just need', 'only want', 'small job', 'quick fix'],
    category: 'scope',
    response: 'Absolutely, we\'re happy to help with projects of any size. Let me give you a quote for just what you need. And if you ever want to do more down the road, we\'ll be here.',
    alternateResponses: [
      'No problem at all. We do plenty of smaller projects. While I\'m there, I can also take a quick look and let you know if there\'s anything else you might want to address — no pressure.',
      'Perfect, let\'s focus on exactly what you need. Quick and simple is our specialty for jobs like this.',
    ],
  },
]
