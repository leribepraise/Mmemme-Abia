import React from "react";
import SiteCard from "../historicalSitesPage/SiteCard";

const sites = [
  {
    id: 1,
    image: "/religious1.png",
    badge: "Popular",
    name: "St. Michael's Catholic Church",
    location: "Umuahia, Abia State",
    rating: 4.6,
    reviews: 242,
    category: "Church",
  },
  {
    id: 2,
    image: "/religious2.png",
    badge: "Top Rated",
    name: "National War Museum Church",
    location: "Umuahia, Abia State",
    rating: 4.7,
    reviews: 216,
    category: "Church",
  },
  {
    id: 3,
    image: "/religious3.png",
    badge: "New",
    name: "Central Mosque, Umuahia",
    location: "Umuahia, Abia State",
    rating: 4.5,
    reviews: 178,
    category: "Mosque",
  },
  {
    id: 4,
    image: "/religious4.png",
    badge: "Popular",
    name: "Assemblies of God Church",
    location: "Aba, Abia State",
    rating: 4.4,
    reviews: 189,
    category: "Church",
  },
  {
    id: 5,
    image: "/religious5.png",
    badge: "Top Rated",
    name: "Our Lady of Africa Parish",
    location: "Ibeku, Umuahia",
    rating: 4.6,
    reviews: 154,
    category: "Church",
  },
  {
    id: 6,
    image: "/religious6.png",
    badge: "Popular",
    name: "St. Mary's Anglican Church",
    location: "Aba, Abia State",
    rating: 4.3,
    reviews: 132,
    category: "Church",
  },
  {
    id: 7,
    image: "/religious7.png",
    badge: "New",
    name: "Seventh-day Adventist Church",
    location: "Aba, Abia State",
    rating: 4.2,
    reviews: 96,
    category: "Church",
  },
  {
    id: 8,
    image: "/religious8.png",
    badge: "Popular",
    name: "Baptist Church Aba",
    location: "Aba, Abia State",
    rating: 4.3,
    reviews: 121,
    category: "Church",
  },
];

const SiteGridReligious = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
};

export default SiteGridReligious;
