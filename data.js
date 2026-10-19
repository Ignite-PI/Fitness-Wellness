// Each issue goes live on its `publish` date. The bonus answer of an issue
// stays hidden until the NEXT issue is published, where it is revealed.
// Each issue shows at most 8 fun facts; any extras are ignored.
window.ISSUES = [
  {
    id: "2026-w40",
    publish: "2026-10-04",
    title: "Smart Snacking",
    subtitle: "Fuel Your Day the Right Way!",
    theme: "#ff8a3d",
    quote: "Eat food. Not too much. Mostly plants.",
    facts: [
      { tag: "Nuts", fact: "Peanuts grow underground and are actually <b>legumes</b>, related to beans and lentils." },
      { tag: "Fruit", fact: "Bananas are roughly <b>75% water</b>, making them a hydrating snack too." },
      { tag: "Vitamins", fact: "A <b>red bell pepper</b> has about twice the vitamin C of an orange." },
      { tag: "Energy", fact: "Pairing protein with carbs slows digestion, helping you <b>stay full longer</b> and avoid energy crashes." },
      { tag: "Avocado", fact: "Gram for gram, avocados contain <b>more potassium than bananas</b>." },
      { tag: "Yogurt", fact: "Yogurt with live cultures contains <b>probiotics</b> that support a healthy gut." },
      { tag: "Popcorn", fact: "Air-popped popcorn is a <b>whole grain</b>, with about 3.5 grams of fiber per 3-cup serving." },
      { tag: "Berries", fact: "Blueberries get their deep color from <b>anthocyanins</b>, powerful antioxidants." }
    ],
    bonus: { q: "Which fruit floats in water because it is about 25% air?", options: ["Apple", "Grape", "Mango", "Avocado"], answer: 0,
      explain: "Apples are about 25% air, which is why bobbing for apples works!" }
  },
  {
    id: "2026-w41",
    publish: "2026-10-11",
    title: "Mind & Mood",
    subtitle: "Train Your Brain!",
    theme: "#7b5cff",
    quote: "You don't have to control your thoughts. You just have to stop letting them control you.",
    facts: [
      { tag: "Nature", fact: "Even a <b>10-minute walk</b> in nature can lift your mood for hours." },
      { tag: "Breathing", fact: "Slow breathing activates the <b>rest-and-digest</b> system, lowering stress." },
      { tag: "Gratitude", fact: "Writing down 3 good things daily is linked to <b>greater happiness</b> and better sleep." },
      { tag: "Focus", fact: "Switching between tasks can cost up to <b>40% of your productive time</b>." },
      { tag: "Music", fact: "Listening to music you love can trigger the release of <b>dopamine</b>, the brain's feel-good chemical." },
      { tag: "Sunlight", fact: "<b>Morning sunlight</b> helps boost your mood and sets your body clock for better sleep." },
      { tag: "Friends", fact: "Strong social connections are linked to <b>lower stress</b> and a longer, healthier life." },
      { tag: "Meditation", fact: "Just <b>10 minutes of daily meditation</b> can help improve attention and ease anxiety." }
    ],
    bonus: { q: "Roughly what percentage of the brain is water?", options: ["25%", "45%", "60%", "75%"], answer: 3,
      explain: "Your brain is about 75% water, so even mild dehydration can affect focus." }
  },
  {
    id: "2026-w42",
    publish: "2026-10-18",
    title: "Fitness & Wellness",
    subtitle: "Test Your Healthy Habits!",
    theme: "#16a085",
    quote: "Healthy habits don't have to be perfect. They just need to be consistent.",
    facts: [
      { tag: "Laughter", fact: "Laughing for just 10-15 minutes can burn up to <b>40 calories</b>!" },
      { tag: "Heart", fact: "Your heart beats about <b>100,000 times every day</b> to keep blood flowing throughout your body." },
      { tag: "Walking", fact: "Walking <b>10,000 steps</b> a day can help improve cardiovascular health and boost energy levels." },
      { tag: "Hydration", fact: "Drinking water before meals may help you <b>feel fuller</b> and support healthy weight management." },
      { tag: "Strength", fact: "Muscle tissue burns more calories at rest than fat tissue, which is why <b>strength training</b> is important." },
      { tag: "Sleep", fact: "Adults who sleep <b>7-9 hours</b> per night tend to have better concentration, mood, and overall health." },
      { tag: "Stretching", fact: "Stretching regularly can improve <b>posture, flexibility</b>, and reduce the risk of injury." },
      { tag: "Movement", fact: "Even a <b>5-minute movement break</b> every hour can help reduce fatigue from prolonged sitting." }
    ],
    bonus: { q: "Which organ uses the most energy in the body?", options: ["Heart", "Liver", "Brain", "Lungs"], answer: 2,
      explain: "The brain is only ~2% of body weight but uses about 20% of your energy!" }
  },
  {
    id: "2026-w43",
    publish: "2026-10-25",
    title: "Sleep Science",
    subtitle: "Rest Up & Recharge!",
    theme: "#2d6cdf",
    quote: "Sleep is the best meditation.",
    facts: [
      { tag: "Screens", fact: "<b>Blue light</b> from screens suppresses melatonin, the sleep hormone." },
      { tag: "Routine", fact: "Going to bed at the same time keeps your <b>circadian rhythm</b> on track." },
      { tag: "Caffeine", fact: "Caffeine has a half-life of about <b>5 hours</b>, so an afternoon coffee can still disrupt your sleep." },
      { tag: "Temperature", fact: "A cool bedroom, around <b>18°C (65°F)</b>, is ideal for most people to sleep well." },
      { tag: "Naps", fact: "A <b>10-20 minute power nap</b> can boost alertness without leaving you groggy." },
      { tag: "Dreams", fact: "Most vivid dreams happen during <b>REM sleep</b>, which cycles about every 90 minutes." },
      { tag: "Memory", fact: "Sleep helps your brain <b>lock in memories</b> and what you learned during the day." },
      { tag: "Bath", fact: "A <b>warm bath 1-2 hours before bed</b> can help you fall asleep faster." }
    ],
    bonus: { q: "Which animal can sleep standing up?", options: ["Horse", "Cat", "Dog", "Rabbit"], answer: 0,
      explain: "Horses lock their legs and can doze standing up." }
  }
];

// Public address of the website once it's published (e.g. "https://trivia.yourcompany.com/").
// Emailed images link here. Leave empty to use the current address (only works on your own computer for localhost).
window.SITE_URL = "";

window.TIPS = ["Stay Hydrated", "Move Daily", "Eat Well", "Sleep Well", "Manage Stress"];
