export const preEvents=[
  {
    name:"Event name",
    image:'/globe.svg',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus nemo natus molestiae enim voluptatum, in nesciunt architecto error quia voluptates expedita aliquam. Rem fuga odio sed voluptatum dolorem illo nihil",
    link:"https://www.google.com"
  },
  {
    name:"Event name",
    image:'/window.svg',
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus nemo natus molestiae enim voluptatum, in nesciunt architecto error quia voluptates expedita aliquam. Rem fuga odio sed voluptatum dolorem illo nihil",
    link:"https://www.google.com"
  }
]



export const Events = [
  {
    name: "School Student Buzzer QUIZ",
    time: "10:30AM - 12:30PM",
    venue: "MCA Seminar Hall",
    type: "buzzerQuiz",
    description:"small detail",
    payStatus:false
  },
  {
    name: "Vibe Coding Challenge",
    time: "1:00PM - 3:00PM",
    venue: "Lab 2",
    type: "vibeCoding",
    description:"small detail.",
  },
  {
    name: "Robotics Workshop",
    time: "3:30PM - 5:00PM",
    venue: "Auditorium",
    type: "workShop",
    description:"small detai.",
  },
];

export function getEventsByType(type: string) {
  return Events.filter(event => event.type === type);
}
