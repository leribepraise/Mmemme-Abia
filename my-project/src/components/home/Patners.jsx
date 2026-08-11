import React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Patners = () => {
  const partners = [
    "/partner1.png",
    "/partner2.png",
    "/partner3.png",
    "/partner4.png",
    "/partner6.png",
    "/partner7.png",
    "/partner8.png",
  ];

  return (
    <>
      {/* <div className="">
        <p className="text-center font-bold text-[21px] py-5">
          Our Partners & Sponsors
        </p>
        <div className="flex justify-center">
          <img src="/patners.png" alt="" className="h-26 w-auto" />
        </div>
      </div> */}
      {/* <section>
        <p className="text-center font-bold text-[21px] py-5">
          Our Partners & Sponsors
        </p>

        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="basis-1/3 md:basis-1/5">
                <div className="flex justify-center items-center">
                  <img
                    src={partner}
                    alt={`Partner ${index + 1}`}
                    className="h-20 w-auto"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section> */}

      <section className="my-10 overflow-hidden">
        <p className="text-center font-bold text-[21px] py-5">
          Our Partners & Sponsors
        </p>

        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee">
            {/* First set */}
            {partners.map((partner, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center justify-center shrink-0 mx-10"
              >
                <img
                  src={partner}
                  alt={`Partner ${index + 1}`}
                  className="h-20 w-auto"
                />
              </div>
            ))}

            {/* Duplicate set */}
            {partners.map((partner, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center justify-center shrink-0 mx-10"
              >
                <img
                  src={partner}
                  alt={`Partner ${index + 1}`}
                  className="h-20 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Patners;
