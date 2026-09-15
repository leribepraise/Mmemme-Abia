import React from "react";
import SiteCard from "../historicalSitesPage/SiteCard";

const sites = [
  {
    id: 1,
    image: "/adventure1.png",
    badge: "Popular",
    name: "Arochukwu Long Juju Hike",
    location: "Arochukwu, Abia State",
    rating: 4.8,
    reviews: 242,
    category: "Hiking",
  },
  {
    id: 2,
    image: "/adventure2.png",
    badge: "Top Rated",
    name: "Kayaking on Osisioma River",
    location: "Aba, Abia State",
    rating: 4.7,
    reviews: 198,
    category: "Water Activity",
  },
  {
    id: 3,
    image: "/adventure3.png",
    badge: "New",
    name: "Waterfall Rappelling",
    location: "Umuahia, Abia State",
    rating: 4.6,
    reviews: 156,
    category: "Adventure",
  },
  {
    id: 4,
    image: "/adventure4.png",
    badge: "Popular",
    name: "Ukwu Rock Climbing",
    location: "Ukwu, Abia State",
    rating: 4.5,
    reviews: 142,
    category: "Rock Climbing",
  },
  {
    id: 5,
    image: "/adventure5.png",
    badge: "Top Rated",
    name: "Akaeze Cave Exploration",
    location: "Isiala Ngwa North, Abia State",
    rating: 4.7,
    reviews: 176,
    category: "Caving",
  },
  {
    id: 6,
    image: "/adventure6.png",
    badge: "Popular",
    name: "Ngwa Hills Trek",
    location: "Obi Ngwa, Abia State",
    rating: 4.6,
    reviews: 126,
    category: "Trekking",
  },
  {
    id: 7,
    image: "/adventure7.png",
    badge: "New",
    name: "Adventure Zipline",
    location: "Umuahia, Abia State",
    rating: 4.4,
    reviews: 112,
    category: "Adventure",
  },
  {
    id: 8,
    image: "/adventure8.png",
    badge: "Popular",
    name: "River Tubing Experience",
    location: "Aba River, Abia State",
    rating: 4.5,
    reviews: 98,
    category: "Water Activity",
  },
];

const SiteGridAdventure = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
};

export default SiteGridAdventure;
