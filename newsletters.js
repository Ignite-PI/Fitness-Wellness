// Monthly newsletters, newest last. Shown on newsletter.html (?month=YYYY-MM opens a specific month).
// - Put photos in images/newsletter/<month>/ and reference them by path.
// - Text supports <b>...</b>; separate paragraphs with a blank line (\n\n).
// - The Trivia recap is automatic: it lists the released trivia issues from that month.
// - `winners` are typed in from the Admin page Leaderboard (top scorers of the month).
// - `sample: true` shows a "sample content" banner; remove it for real issues.
window.NEWSLETTERS = [
  {
    month: "2026-10",
    sample: true,
    headline: "Fall Into Wellness",
    theme: "#16a085",
    intro: "Welcome to the very first issue of our monthly wellness newsletter! Here's a look back at everything we did together this month, plus what's coming up next.",
    cover: "images/newsletter/2026-10/cover.svg",
    articles: [
      {
        title: "Steps Challenge Kicks Off",
        text: "Over <b>40 associates</b> joined our first steps challenge this month. Together we walked more than <b>1.2 million steps</b>!\n\nKeep it up: the challenge runs until the end of November.",
        images: [{ src: "images/newsletter/2026-10/photo-1.svg", caption: "Team walk during lunch break" }]
      },
      {
        title: "Healthy Potluck Recap",
        text: "Thank you to everyone who brought a dish! From fresh salads to fruit platters, it was proof that <b>healthy food can be delicious</b>.",
        images: [
          { src: "images/newsletter/2026-10/photo-2.svg", caption: "The salad table" },
          { src: "images/newsletter/2026-10/photo-3.svg", caption: "Fruit platter winners" }
        ]
      }
    ],
    gallery: [
      { src: "images/newsletter/2026-10/photo-1.svg", caption: "Lunch walk" },
      { src: "images/newsletter/2026-10/photo-2.svg", caption: "Potluck" },
      { src: "images/newsletter/2026-10/photo-3.svg", caption: "Fruit platters" },
      { src: "images/newsletter/2026-10/photo-4.svg", caption: "Stretch break" },
      { src: "images/newsletter/2026-10/photo-5.svg", caption: "Hydration station" },
      { src: "images/newsletter/2026-10/photo-6.svg", caption: "Team photo" }
    ],
    winners: [
      { name: "Ana Santos", points: 9 },
      { name: "Ben Cruz", points: 6 },
      { name: "Carla Reyes", points: 6 }
    ],
    announcements: [
      { date: "2026-11-05", title: "Flu Shot Clinic", text: "Free flu shots at the 3rd floor clinic, 9 AM to 3 PM." },
      { date: "2026-11-12", title: "Wellness Webinar: Sleep Better", text: "Join us on Teams at 2 PM for tips on getting quality rest." },
      { date: "2026-11-30", title: "Steps Challenge Ends", text: "Submit your final step count by 5 PM." }
    ]
  }
];
