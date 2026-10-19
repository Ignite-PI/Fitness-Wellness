// Issues go live when you click "Release" on the Admin page (admin.html).
// `publish` is the planned date shown on the issue. The bonus answer of an issue
// stays hidden until the NEXT issue is released, where it is revealed.
// Each issue shows at most 8 fun facts; any extras are ignored.
// Each fact's picture comes from `icon` (or its `tag` if no icon is set) in icons.js.
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
  },

  // ---------------- NOVEMBER ----------------
  {
    id: "2026-w44",
    publish: "2026-11-01",
    title: "Heart Health",
    subtitle: "Love Your Heart!",
    theme: "#e0435a",
    quote: "Take care of your body. It's the only place you have to live.",
    facts: [
      { tag: "Heart", fact: "Your heart pumps about <b>7,000 liters of blood</b> through your body every single day." },
      { tag: "Walking", fact: "Just <b>30 minutes of brisk walking</b>, 5 days a week, supports a stronger, healthier heart." },
      { tag: "Salt", fact: "Most adults should keep sodium under <b>2,300 mg a day</b>, about one teaspoon of salt." },
      { tag: "Fish", fact: "Fatty fish like salmon and sardines are rich in <b>omega-3s</b>, which support heart health." },
      { tag: "Laughter", fact: "A good laugh helps your <b>blood vessels relax</b>, improving blood flow." },
      { tag: "Sleep", fact: "Regularly sleeping <b>less than 6 hours</b> a night is linked to a higher risk of heart disease." },
      { tag: "Nuts", fact: "A small handful of <b>unsalted nuts</b> a few times a week is linked to better heart health." },
      { tag: "Stress", icon: "breathing", fact: "Ongoing stress can raise <b>blood pressure</b>. Slow, deep breathing helps calm it down." }
    ],
    bonus: { q: "How many chambers does the human heart have?", options: ["2", "3", "4", "5"], answer: 2,
      explain: "The heart has 4 chambers: 2 atria on top and 2 ventricles below." }
  },
  {
    id: "2026-w45",
    publish: "2026-11-08",
    title: "Hydration Heroes",
    subtitle: "Sip Your Way to Health!",
    theme: "#2d8fdf",
    quote: "Water is the driving force of all nature.",
    facts: [
      { tag: "Hydration", fact: "About <b>60% of an adult's body</b> is made up of water." },
      { tag: "Brain", icon: "memory", fact: "Even <b>mild dehydration</b> (losing 1-2% of body water) can affect focus and mood." },
      { tag: "Veggies", icon: "broccoli", fact: "Cucumbers and lettuce are about <b>95% water</b>, so food counts toward hydration too." },
      { tag: "Bottle", fact: "Keeping a <b>reusable water bottle</b> in sight is an easy way to drink more through the day." },
      { tag: "Coffee", icon: "caffeine", fact: "Moderate amounts of coffee and tea <b>still count</b> toward your daily fluids." },
      { tag: "Fatigue", icon: "energy", fact: "Feeling tired or getting a headache can be an early sign you need <b>more water</b>." },
      { tag: "Cold Weather", icon: "temperature", fact: "You still lose water in <b>cold weather</b> through breathing and sweat, so keep sipping." },
      { tag: "Exercise", icon: "strength", fact: "During exercise, aim to sip water every <b>15-20 minutes</b> to stay hydrated." }
    ],
    bonus: { q: "Which of these foods has the highest water content?", options: ["Apple", "Banana", "Cucumber", "Bread"], answer: 2,
      explain: "Cucumbers are about 95% water, making them one of the most hydrating foods." }
  },
  {
    id: "2026-w46",
    publish: "2026-11-15",
    title: "Gut Health",
    subtitle: "Happy Gut, Happy You!",
    theme: "#22a565",
    quote: "All disease begins in the gut. - Hippocrates",
    facts: [
      { tag: "Second Brain", icon: "memory", fact: "Your gut has about <b>500 million neurons</b>, which is why it's called your 'second brain'." },
      { tag: "Fiber", icon: "broccoli", fact: "Most adults need about <b>25-30 grams of fiber</b> a day, but many get only half that." },
      { tag: "Fermented", icon: "yogurt", fact: "Fermented foods like <b>yogurt, kefir, and kimchi</b> add helpful bacteria to your gut." },
      { tag: "Water", icon: "hydration", fact: "Water helps fiber do its job and keeps <b>digestion moving</b> smoothly." },
      { tag: "After-Meal Walk", icon: "walking", fact: "A short <b>walk after meals</b> can aid digestion and help steady blood sugar." },
      { tag: "Whole Grains", icon: "popcorn", fact: "Whole grains like oats, brown rice, and popcorn <b>feed the good bacteria</b> in your gut." },
      { tag: "Gut-Brain", icon: "meditation", fact: "Stress can upset your stomach, because your gut and brain <b>talk to each other</b> constantly." },
      { tag: "Eat Slowly", icon: "routine", fact: "It takes about <b>20 minutes</b> for your brain to register that you're full, so eat slowly." }
    ],
    bonus: { q: "About how long is the adult human digestive tract?", options: ["1 meter", "3 meters", "9 meters", "20 meters"], answer: 2,
      explain: "From mouth to end, the digestive tract is about 9 meters (30 feet) long!" }
  },
  {
    id: "2026-w47",
    publish: "2026-11-22",
    title: "Stress Less",
    subtitle: "Find Your Calm!",
    theme: "#7b5cff",
    quote: "Almost everything will work again if you unplug it for a few minutes, including you.",
    facts: [
      { tag: "Box Breathing", icon: "breathing", fact: "Box breathing (inhale 4, hold 4, exhale 4, hold 4) can <b>calm your nervous system</b> in minutes." },
      { tag: "Nature", fact: "Spending at least <b>2 hours a week in nature</b> is linked to better health and wellbeing." },
      { tag: "Music", fact: "Slow, calming music can help <b>lower your heart rate</b> and ease stress." },
      { tag: "Laughter", fact: "Laughing lowers stress hormones like <b>cortisol</b> and boosts feel-good endorphins." },
      { tag: "Digital Detox", icon: "screens", fact: "Taking breaks from <b>news and social media</b> can ease anxiety and lift your mood." },
      { tag: "Tea", fact: "Sipping a warm, caffeine-free <b>herbal tea</b> makes a soothing wind-down ritual." },
      { tag: "Talk It Out", icon: "friends", fact: "Sharing your worries with someone you trust can <b>lighten the load</b>." },
      { tag: "To-Do List", icon: "gratitude", fact: "Writing a quick <b>to-do list before bed</b> can help you fall asleep faster." }
    ],
    bonus: { q: "Which hormone is known as the body's main 'stress hormone'?", options: ["Insulin", "Cortisol", "Melatonin", "Serotonin"], answer: 1,
      explain: "Cortisol is released by your adrenal glands when you're stressed." }
  },
  {
    id: "2026-w48",
    publish: "2026-11-29",
    title: "Immunity Boost",
    subtitle: "Stay Strong This Season!",
    theme: "#ff8a3d",
    quote: "An ounce of prevention is worth a pound of cure. - Benjamin Franklin",
    facts: [
      { tag: "Handwashing", icon: "soap", fact: "Washing your hands with soap for <b>20 seconds</b> is one of the best ways to prevent illness." },
      { tag: "Sleep", fact: "People who sleep <b>less than 6 hours</b> a night are more likely to catch a cold." },
      { tag: "Vitamin C", icon: "orange", fact: "Citrus fruits, bell peppers, and broccoli are rich in <b>vitamin C</b>, which supports your immune system." },
      { tag: "Vitamin D", icon: "sunlight", fact: "Your skin makes <b>vitamin D</b> from sunlight, and it plays a key role in immunity." },
      { tag: "Stay Active", icon: "walking", fact: "Regular moderate exercise helps <b>immune cells</b> circulate through your body." },
      { tag: "Gut & Immunity", icon: "yogurt", fact: "About <b>70% of your immune system</b> is located in your gut." },
      { tag: "Stress", icon: "meditation", fact: "Long-term stress can <b>weaken your immune response</b>, so make time to relax." },
      { tag: "Hydration", fact: "Drinking enough water keeps your nose and throat <b>moist so they can trap germs</b>." }
    ],
    bonus: { q: "How long should you scrub your hands with soap?", options: ["5 seconds", "10 seconds", "20 seconds", "2 minutes"], answer: 2,
      explain: "At least 20 seconds, about the time it takes to hum 'Happy Birthday' twice." }
  },

  // ---------------- DECEMBER ----------------
  {
    id: "2026-w49",
    publish: "2026-12-06",
    title: "Healthy Holiday Eating",
    subtitle: "Feast Smart!",
    theme: "#d35400",
    quote: "Enjoy the treats, savor the moments, and keep moving.",
    facts: [
      { tag: "Added Sugar", icon: "sugar", fact: "Adults are advised to keep added sugar to about <b>25-36 grams a day</b>, around 6-9 teaspoons." },
      { tag: "Smart Swaps", icon: "berries", fact: "Swapping a sugary dessert for <b>fruit</b> satisfies a sweet tooth with fiber and vitamins." },
      { tag: "Mindful Eating", icon: "meditation", fact: "Eating without screens helps you <b>notice when you're full</b>." },
      { tag: "Thirst or Hunger?", icon: "hydration", fact: "Thirst is sometimes mistaken for <b>hunger</b>, so try a glass of water first." },
      { tag: "Veggies First", icon: "broccoli", fact: "Filling <b>half your plate with vegetables</b> is an easy way to balance a holiday meal." },
      { tag: "Holiday Walk", icon: "walking", fact: "A family <b>walk after a big meal</b> helps digestion and steadies blood sugar." },
      { tag: "Healthy Snacks", icon: "nuts", fact: "Unsalted nuts are a <b>filling snack</b> packed with healthy fats and protein." },
      { tag: "Rest", icon: "sleep", fact: "Short sleep can increase <b>hunger hormones</b> and cravings for sweets." }
    ],
    bonus: { q: "Which nutrient helps you feel full the longest?", options: ["Sugar", "Protein", "Salt", "Caffeine"], answer: 1,
      explain: "Protein digests slowly and helps keep hunger in check for longer." }
  },
  {
    id: "2026-w50",
    publish: "2026-12-13",
    title: "Winter Wellness",
    subtitle: "Stay Warm & Well!",
    theme: "#1e88e5",
    quote: "There's no such thing as bad weather, only unsuitable clothing.",
    facts: [
      { tag: "Cold Weather", icon: "snowflake", fact: "Your body burns <b>extra energy</b> to keep you warm in cold weather." },
      { tag: "Daylight", icon: "sunlight", fact: "Getting outside in <b>morning daylight</b> can help beat the winter blues." },
      { tag: "Indoor Workouts", icon: "strength", fact: "No gym needed: <b>squats, push-ups, and planks</b> build strength right at home." },
      { tag: "Layer Up", icon: "temperature", fact: "Dressing in <b>layers</b> traps warm air and keeps you comfortable outdoors." },
      { tag: "Dry Eyes", icon: "eye", fact: "Indoor heating dries the air. <b>Blinking often</b> and using a humidifier help soothe dry eyes." },
      { tag: "Warm Drinks", icon: "tea", fact: "Warm soups and teas count toward your <b>daily fluids</b>." },
      { tag: "Warm Up", icon: "stretching", fact: "Warming up for <b>5-10 minutes</b> before exercise is extra important in the cold." },
      { tag: "Seasonal Veggies", icon: "carrot", fact: "Carrots and sweet potatoes are rich in <b>beta-carotene</b>, which your body turns into vitamin A." }
    ],
    bonus: { q: "Which vitamin does your skin make from sunlight?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], answer: 2,
      explain: "Sunlight on your skin helps your body make vitamin D, which is harder to get in winter." }
  },
  {
    id: "2026-w51",
    publish: "2026-12-20",
    title: "Joy & Giving",
    subtitle: "Spread Holiday Cheer!",
    theme: "#c2185b",
    quote: "No one has ever become poor by giving. - Anne Frank",
    facts: [
      { tag: "Giving", icon: "gift", fact: "Doing kind things for others can trigger a <b>'helper's high'</b> that boosts your mood." },
      { tag: "Connection", icon: "friends", fact: "Quality time with loved ones can <b>lower stress</b> and boost happiness." },
      { tag: "Laugh Together", icon: "laughter", fact: "You're about <b>30 times more likely</b> to laugh when you're with others than alone." },
      { tag: "Sing Along", icon: "music", fact: "Singing with others can lift your mood and <b>release endorphins</b>." },
      { tag: "Thank-You Notes", icon: "gratitude", fact: "Writing a <b>thank-you note</b> can boost happiness for both you and the reader." },
      { tag: "Holiday Rest", icon: "sleep", fact: "Keeping a <b>regular sleep schedule</b> during the holidays helps protect your energy and mood." },
      { tag: "Holiday Stress", icon: "breathing", fact: "Planning ahead and <b>saying no</b> when needed helps keep holiday stress in check." },
      { tag: "Fresh Air", icon: "nature", fact: "A <b>short walk outside</b> is a free, quick way to reset your mood." }
    ],
    bonus: { q: "Which 'feel-good' hormone is released when you hug someone?", options: ["Adrenaline", "Oxytocin", "Cortisol", "Insulin"], answer: 1,
      explain: "Oxytocin, often called the 'cuddle hormone', helps us feel connected and calm." }
  },
  {
    id: "2026-w52",
    publish: "2026-12-27",
    title: "New Year, New Habits",
    subtitle: "Start Small, Win Big!",
    theme: "#e69500",
    quote: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    facts: [
      { tag: "Habits", icon: "calendar", fact: "Research suggests it takes about <b>66 days</b> on average to form a new habit." },
      { tag: "Small Goals", icon: "focus", fact: "<b>Small, specific goals</b> are easier to stick to than big, vague ones." },
      { tag: "Habit Stacking", icon: "routine", fact: "Link a new habit to an old one, like <b>stretching right after brushing your teeth</b>." },
      { tag: "Track It", icon: "gratitude", fact: "Tracking progress, even with a simple <b>checklist</b>, helps you stay motivated." },
      { tag: "Move More", icon: "walking", fact: "Adding just <b>1,000 extra steps</b> a day is a great starting goal." },
      { tag: "Water First", icon: "bottle", fact: "Starting your morning with a <b>glass of water</b> is an easy habit to build." },
      { tag: "Buddy System", icon: "friends", fact: "Having a <b>workout buddy</b> makes you more likely to stick with exercise." },
      { tag: "Be Kind to Yourself", icon: "heart", fact: "Missing one day <b>doesn't ruin a habit</b>. Just get back on track the next day." }
    ],
    bonus: { q: "On average, how long does it take to form a new habit?", options: ["7 days", "21 days", "66 days", "365 days"], answer: 2,
      explain: "A University College London study found it takes about 66 days on average, so be patient!" }
  }
];

// Public address of the website once it's published (e.g. "https://trivia.yourcompany.com/").
// Emailed images link here. Leave empty to use the current address (only works on your own computer for localhost).
window.SITE_URL = "https://ignite-pi.github.io/Fitness-Wellness/";

window.TIPS = ["Stay Hydrated", "Move Daily", "Eat Well", "Sleep Well", "Manage Stress"];
