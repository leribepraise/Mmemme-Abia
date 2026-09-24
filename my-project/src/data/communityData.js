export const currentUserId = "u1";

export const users = [
  { id: "u1", name: "You", avatar: "/davido.png", online: true },
  {
    id: "u2",
    name: "Adaeze Nwachukwu",
    email: "adanwa.5@gmail.com",
    avatar: "/davido.png",
    online: true,
  },
  { id: "u3", name: "Emeka Uba", avatar: "/davido.png", online: false },
  { id: "u4", name: "Chisom Okorie", avatar: "/davido.png", online: false },
  { id: "u5", name: "Chinedu", avatar: "/davido.png", online: true },
];

export const conversations = [
  {
    id: "c1",
    type: "direct",
    participantIds: ["u1", "u2"],
    name: null,
    avatar: null,
    messages: [
      {
        id: "m1",
        senderId: "u2",
        text: "Hello,\nCan we get to know each other?\nAm from Arochukwu, you?",
        timestamp: "2026-09-19T10:20:00",
      },
      {
        id: "m2",
        senderId: "u1",
        text: "Hello Ada,\nThanks for reaching out.\nYes, we can. I am from Bende\nHow are you doing?",
        timestamp: "2026-09-19T10:25:00",
      },
      {
        id: "m3",
        senderId: "u2",
        text: "Great!\nAm doing okay, nice meeting you",
        timestamp: "2026-09-19T10:30:00",
      },
      {
        id: "m4",
        senderId: "u1",
        text: "Awesome! 🎉",
        timestamp: "2026-09-19T10:37:00",
      },
    ],
  },
  {
    id: "c2",
    type: "group",
    participantIds: ["u1", "u2", "u5"],
    name: "Travel Abia Group",
    avatar: "/davido.png",
    messages: [
      {
        id: "m5",
        senderId: "u5",
        text: "Chinedu: Check this out!",
        timestamp: "2026-09-19T10:32:00",
      },
    ],
  },
  {
    id: "c3",
    type: "direct",
    participantIds: ["u1", "u3"],
    name: null,
    avatar: null,
    messages: [
      {
        id: "m6",
        senderId: "u3",
        text: "Thanks so much!",
        timestamp: "2026-09-19T10:22:00",
      },
    ],
  },
  {
    id: "c4",
    type: "group",
    participantIds: ["u1", "u2", "u3"],
    name: "Abia Food Lovers",
    avatar: "/davido.png",
    messages: [
      {
        id: "m7",
        senderId: "u2",
        text: "New recipe shared",
        timestamp: "2026-09-19T09:37:00",
      },
    ],
  },
  {
    id: "c5",
    type: "direct",
    participantIds: ["u1", "u4"],
    name: null,
    avatar: null,
    messages: [
      {
        id: "m8",
        senderId: "u4",
        text: "Okay, see you there.",
        timestamp: "2026-09-19T08:37:00",
      },
    ],
  },
];
