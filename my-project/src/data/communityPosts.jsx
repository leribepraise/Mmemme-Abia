export const initialPosts = [
  {
    id: "p1",
    author: { name: "Chinedu Okafor", avatar: "/davido.png" },
    location: "Umuahia, Abia State",
    timeAgo: "2h",
    text: "The Arochukwu Long Juju monument is such a beautiful piece of our history and culture. Abia is blessed! ❤️",
    image: "/davido.png",
    likes: 106,
    comments: 45,
    shares: 12,
  },
  {
    id: "p2",
    author: { name: "Ebusco de Great", avatar: "/davido.png" },
    location: "Aba, Abia State",
    timeAgo: "2h",
    text: "My first time in the Nnenna Bus Terminal😊",
    image: "/davido.png",
    likes: 106,
    comments: 45,
    shares: 12,
  },
];

export const loadPosts = () => {
  const saved = sessionStorage.getItem("communityPosts");
  try {
    const parsed = saved ? JSON.parse(saved) : null;
    return Array.isArray(parsed) ? parsed : initialPosts;
  } catch {
    return initialPosts;
  }
};

export const savePosts = (posts) => {
  sessionStorage.setItem("communityPosts", JSON.stringify(posts));
};
