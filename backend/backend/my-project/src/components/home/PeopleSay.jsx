//
import React from "react";

const PeopleSay = () => {
  const peoples = [
    {
      image: "/image1.png",
      name: "Chidinma O.",
      place: "Umuahia",
      rating: "/rating.png",
      text2:
        "“Mmemme Abia helped me discover amazing events I never knew existed. The booking process is so smooth!”",
    },
    {
      image: "/image2.png",
      name: "Ifeanyi E.",
      place: "Aba",
      rating: "/rating.png",
      text2:
        "“I love how easy it is to find and book tickets. The app and the website are top-notch.”",
    },
    {
      image: "/image3.png",
      name: "Ngozi Chidiebera",
      place: "Arochukwu",
      rating: "/rating.png",
      text2:
        "“From concerts to cultural festivals, Mmemme Abia has everything. Highly recommended!”",
    },
  ];

  return (
    <section className="my-10">
      <h1 className="text-center md:text-left text-[30px] font-bold mb-5">
        What People Are Saying{" "}
      </h1>

      {/* RESPONSIVE CHANGE:
          Mobile  → 1 column
          Tablet  → 2 columns
          Laptop  → 3 columns
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {peoples.map((people) => (
          <div
            key={people.name}
            className="
              bg-[#EFFFCF]
              w-full
              lg:w-100
              h-fit
              flex
              gap-8
              justify-center
              pt-5
              pb-4
              px-2
              rounded-[15px] 
            "
          >
            <img src={people.image} alt="" className="h-20 w-auto shrink-0" />

            <div className="flex flex-col min-w-0">
              <p className="font-semibold text-[16px]">{people.name}</p>

              <img src={people.rating} alt="" className="w-[120px] h-[19px]" />

              <p className="font-normal text-[14px]">{people.place}</p>

              <p className="font-normal text-[14px]">{people.text2}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PeopleSay;
