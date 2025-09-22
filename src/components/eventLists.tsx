export const Events = [
  {
    name: "School Student Buzzer QUIZ",
    time: "10:30AM - 12:30PM",
    venue: "MCA Seminar Hall",
    type: "buzzerQuiz",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, nemo, eum perspiciatis nesciunt nihil sit veritatis quaerat neque quos, dicta aut pariatur adipisci. Ea, sequi eos perferendis fuga dignissimos repudiandae.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, nemo, eum perspiciatis nesciunt nihil sit veritatis quaerat neque quos, dicta aut pariatur adipisci. Ea, sequi eos perferendis fuga dignissimos repudiandae.",
    payStatus:false
  },
  {
    name: "Vibe Coding Challenge",
    time: "1:00PM - 3:00PM",
    venue: "Lab 2",
    type: "vibeCoding",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, nemo, eum perspiciatis nesciunt nihil sit veritatis quaerat neque quos, dicta aut pariatur adipisci. Ea, sequi eos perferendis fuga dignissimos repudiandae.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, nemo, eum perspiciatis nesciunt nihil sit veritatis quaerat neque quos, dicta aut pariatur adipisci. Ea, sequi eos perferendis fuga dignissimos repudiandae.",
  },
  {
    name: "Robotics Workshop",
    time: "3:30PM - 5:00PM",
    venue: "Auditorium",
    type: "workShop",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, nemo, eum perspiciatis nesciunt nihil sit veritatis quaerat neque quos, dicta aut pariatur adipisci. Ea, sequi eos perferendis fuga dignissimos repudiandae.Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum, nemo, eum perspiciatis nesciunt nihil sit veritatis quaerat neque quos, dicta aut pariatur adipisci. Ea, sequi eos perferendis fuga dignissimos repudiandae.",
  },
];

export function getEventsByType(type: string) {
  return Events.filter(event => event.type === type);
}
