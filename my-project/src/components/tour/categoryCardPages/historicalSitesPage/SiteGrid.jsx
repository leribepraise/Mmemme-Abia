import React from "react";
import SiteCard from "./SiteCard";

const sites = [
  {
    id: 1,
    image: "/site1.jpg",
    badge: "Popular",
    name: "Arochukwu Colonial Buildings",
    location: "Arochukwu, Abia State",
    rating: 4.6,
    reviews: 230,
    category: "Colonial Era",
  },
  {
    id: 2,
    image: "/site2.jpg",
    badge: "Top Rated",
    name: "Old Arochukwu Prison",
    location: "Arochukwu, Abia State",
    rating: 4.5,
    reviews: 188,
    category: "Colonial Era",
  },
  {
    id: 3,
    image: "/site3.jpg",
    badge: "New",
    name: "Umuahia War Memorial",
    location: "Umuahia, Abia State",
    rating: 4.4,
    reviews: 156,
    category: "Monument",
  },
  {
    id: 4,
    image: "/site4.jpg",
    badge: "Popular",
    name: "Michael Okpara Square",
    location: "Umuahia, Abia State",
    rating: 4.3,
    reviews: 142,
    category: "Monument",
  },
  {
    id: 5,
    image: "/site5.jpg",
    badge: "Top Rated",
    name: "Abia State Museum",
    location: "Umuahia, Abia State",
    rating: 4.6,
    reviews: 312,
    category: "Museum",
  },
  {
    id: 6,
    image: "/site6.jpg",
    badge: "New",
    name: "Nsulu Ancient Shrine",
    location: "Nsulu, Isiala Ngwa North",
    rating: 4.4,
    reviews: 198,
    category: "Archaeological Site",
  },
];

const SiteGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
};

export default SiteGrid;
