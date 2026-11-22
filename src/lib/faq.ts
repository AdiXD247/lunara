export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How does Lunara predict my next period?",
    a: "Every time you log a period, Lunara measures the gap between your cycle starts and averages them. If your cycles are irregular it weights your most recent ones a little more heavily. Your predicted date updates automatically every time you log.",
  },
  {
    q: "Where is my data stored?",
    a: "Entirely in your own browser, on this device. There is no server, no account database and nothing sent anywhere. Clearing your browser data will clear your logs, so treat it like a notebook you keep in your pocket.",
  },
  {
    q: "How accurate are the ovulation and fertile window predictions?",
    a: "Lunara estimates ovulation as roughly 14 days before your next period and highlights a six-day fertile window around it. It is a good planning aid, but it is an estimate — it is not a contraceptive and should not be used as one.",
  },
  {
    q: "Can I use Lunara if my cycle is irregular?",
    a: "Yes. Log four or more periods and Lunara will learn your personal average instead of assuming a textbook 28 days. You can also set your own cycle and period length manually in Settings.",
  },
  {
    q: "What can I track each day?",
    a: "Flow intensity, physical symptoms like cramps, headaches and bloating, mood, and free-form notes. Anything you skip is simply treated as a no — there is no obligation to log every day.",
  },
  {
    q: "Do I need an account?",
    a: "You create a local account with just a name, email and password so that multiple people can use the same browser without mixing up their cycles. It never leaves your device.",
  },
  {
    q: "Is Lunara a medical device?",
    a: "No. Lunara is a tracking and education tool. It can help you notice patterns worth talking about with a clinician, but it does not diagnose anything. Speak to a healthcare professional about any concerns.",
  },
  {
    q: "How do I delete everything?",
    a: "Settings → Danger zone → Clear all cycle data removes your logs in one click. Deleting the app's browser storage removes the account too.",
  },
];
