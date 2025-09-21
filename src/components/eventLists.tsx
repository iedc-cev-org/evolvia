export const Events = [
  {
    name: "School Student Buzzer QUIZ",
    time: "10:30AM - 12:30PM",
    venue: "MCA Seminar Hall",
    type: "buzzerQuiz",
  },
  {
    name: "Vibe Coding Challenge",
    time: "1:00PM - 3:00PM",
    venue: "Lab 2",
    type: "vibeCoding",
  },
  {
    name: "Robotics Workshop",
    time: "3:30PM - 5:00PM",
    venue: "Auditorium",
    type: "workShop",
  },
];

export function getEventsByType(type: string) {
  return Events.filter(event => event.type === type);
}
