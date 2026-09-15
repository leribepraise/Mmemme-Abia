import React from "react";
import SiteCardMultiTag from "./SiteCardMultiTag";

const sites = [
  {
    id: 1,
    image: "/cave1.jpg",
    badge: "Popular",
    name: "Isi-ume Cave",
    location: "Uturu, Isuikwuato LGA",
    rating: 4.7,
    reviews: 156,
    type: "Cave",
    tags: ["Easy Access", "Family Friendly"],
  },
  {
    id: 2,
    image: "/cave2.jpg",
    badge: "Top Rated",
    name: "Ogbunike Cave",
    location: "Umuahia South LGA",
    rating: 4.6,
    reviews: 132,
    type: "Cave",
    tags: ["Moderate", "Adventure"],
  },
  {
    id: 3,
    image: "/cave3.jpg",
    badge: "New",
    name: "Uwaare Cave",
    location: "Ukwa East, Abia State",
    rating: 4.4,
    reviews: 98,
    type: "Cave",
    tags: ["Easy Access", "Nature"],
  },
  {
    id: 4,
    image: "/hill1.jpg",
    badge: "Popular",
    name: "Ngwa Hills",
    location: "Obi Ngwa, Abia State",
    rating: 4.6,
    reviews: 188,
    type: "Hill",
    tags: ["Scenic", "Hiking"],
  },
  {
    id: 5,
    image: "/hill2.jpg",
    badge: "Top Rated",
    name: "Arochukwu Hills",
    location: "Arochukwu, Abia State",
    rating: 4.5,
    reviews: 142,
    type: "Hill",
    tags: ["Moderate", "Panoramic View"],
  },
  {
    id: 6,
    image: "/hill3.jpg",
    badge: "New",
    name: "Ikwuano Hills",
    location: "Ikwuano LGA, Abia State",
    rating: 4.3,
    reviews: 96,
    type: "Hill",
    tags: ["Hiking", "Nature"],
  },
];

const SiteGridCaves = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
      {sites.map((site) => (
        <SiteCardMultiTag key={site.id} site={site} />
      ))}
    </div>
  );
};

export default SiteGridCaves;
