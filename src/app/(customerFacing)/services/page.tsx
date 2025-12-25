import ContactUs from "../../../components/sections/ContactUs";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import React from "react";
import { ServicesMRC } from "../../../..";
import { ServicesSPM } from "../../../..";

import styles from "./Services.module.scss";

const page = () => {
  return (
    <div className="flex flex-col">
      <div className="relative w-full h-[658px]  xlScreen:h-[800px] max-mobile:h-[480px] max-smMobie:h-[254px] overflow-hidden">
        <Image
          src="/Service Hero Section Image.svg"
          alt="hero Image"
          fill
          className="object-cover"
        />
        {/* SEO + Screen Reader-Only Heading */}
        <h1 className="sr-only">
          Services Offered by Santa Paula Materials and MRC Rock & Sand –
          Recycled Building Materials, Rock Reclamation, and Onsite Crushing &
          Screening
        </h1>
        {/* Visible content, hidden from screen readers */}
        <h2
          className="absolute text-whitebase font-bold text-[64px] max-smMobie:text-[40px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          Services
        </h2>
      </div>

      <div className="flex flex-col bg-primary xlScreen:mb-20">
        <h2
          id="SPM"
          className="font-bold text-whitebase text-[40px] my-6 px-[72px] max-smMobie:px-[32px] xlScreen:px-36 max-smMobie:text-[32px]"
        >
          Santa Paula Materials
        </h2>
        {ServicesSPM.map((materials) => (
          <div
            key={materials.id}
            className={`flex bg-tanbase max-mobile:flex-col  ${materials.id == 2 ? "flex-row-reverse" : null}`}
          >
            {/* className="relative w-1/2 max-mobile:h-[480px] max-mobile:aspect-7/6 max-mobile:w-full"  deleted flex justify-center items-center*/}
            <div
              className={`${styles.imageContainer} relative w-1/2  max-mobile:w-full `}
            >
              <Image
                alt="image"
                src={materials.image}
                // width={720}
                // height={566}
                fill
                className="object-cover "
              />
            </div>
            {/* border-2 border-red-500 flex flex-col gap-10 w-1/2 max-mobile:w-full
            p-12 max-smMobie:px-8 xlScreen:px-36 */}
            <div className="flex-col flex gap-10 w-1/2 py-12 px-[72px] max-smMobie:px-8 xlScreen:px-36 max-mobile:w-full justify-center">
              <h1 className="font-bold text-[32px] max-smMobie:text-2xl text-primary-text">
                {materials.name}
              </h1>
              <p className="text-[20px] w-full text-secondary-text max-smMobie:text-base self-stretch">
                {materials.desc}
              </p>
              <div className="flex ">
                {materials.id == 1 ? (
                  <Button variant="outline">View Materials</Button>
                ) : (
                  <Button variant={"outline"}>Contact SPM</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mr rock & Sand */}

      <div className="flex flex-col bg-primary mb-20 max-mobile:mb-16">
        <h2
          id="MRC"
          className="font-bold text-whitebase text-[40px] my-6 px-[72px] max-smMobie:px-[32px] xlScreen:px-36 max-smMobie:text-[32px]"
        >
          MRC Rock & Sand
        </h2>

        {ServicesMRC.map((service) => (
          <div
            key={service.id}
            className={`flex bg-tanbase max-mobile:flex-col ${service.id !== 2 ? "flex-row-reverse" : null}`}
          >
            <div
              className={`${styles.imageContainer} relative w-1/2  max-mobile:w-full`}
            >
              <Image
                alt="image"
                src={service.image}
                // fill
                width={1000}
                height={1000}
                // style={{ objectFit: "cover" }}
                className={styles.image}
              />
            </div>
            <div className="flex-col flex gap-10 w-1/2 py-12 px-[72px] max-smMobie:px-8 xlScreen:px-36 max-mobile:w-full justify-center">
              <h2 className="font-bold text-[32px] max-smMobie:text-2xl text-primary-text">
                {service.name}
              </h2>
              <p className="text-[20px] w-full text-secondary-text max-smMobie:text-base self-stretch">
                {service.desc}
              </p>
              {/* {service.id == 2 && (
                // <div className="flex">
                //   <Button variant={"outline"}>Contact MRC</Button>
                // </div>
              )} */}
            </div>
          </div>
        ))}
      </div>
      <ContactUs />
    </div>
  );
};

export default page;
