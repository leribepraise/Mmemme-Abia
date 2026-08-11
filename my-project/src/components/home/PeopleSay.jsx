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
        "“From  concerts to cultural festivals, Mmemme Abia has everything. Highly recommended!”",
    },
  ];
  return (
    <section className="my-10">
        <h1 className="text-left text-[30px] font-bold mb-5">What People Are Saying </h1>
        <div className="flex gap-5">
          {peoples.map((people) => (
            <div className="bg-[#EFFFCF] w-100 h-fit flex gap-8 justify-center pt-5 pb-4 px-2 rounded-[15px]">
              <img src={people.image} alt="" className="h-20 w-auto"/>
              <div className="flex flex-col">
                <p className="font-semibold text-[16px]">{people.name}</p>
                <img src={people.rating} alt="" className="w-[120px] h-[19px]"/>
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
