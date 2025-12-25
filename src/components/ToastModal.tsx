import React, { useState } from "react";
import Image from "next/image";
import { FooterLink } from "./Footer";

const ToastModal = () => {
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  return (
    <div className="fixed flex flex-col justify-evenly w-full h-full -left-0 top-20 bg-whitebase items-center">
      <div className="bg-primary-dark w-[88px] h-[88px] flex justify-center rounded-full">
        <Image src="/mail.svg" alt="mail" width={48} height={48} />
      </div>
      <h1 className="font-bold text-4xl text-center text-primary-text font-montserrat tracking-[-2.52px">
        Submitted!
      </h1>
      <div className="w-full p-8 flex flex-col items-start gap-8 self-stretch bg-primary -left-0 top-96">
        <p className="self-stretch text-whitebase text-xl leading-normal font-normal not-italic tracking-[-0.8px]">
          Thank you for your inquiry! We have received your message and will
          respond within 24 hours to ensure you receive the most accurate and
          thorough response. If you need a quicker response, please call us at
          the phone number below.
        </p>
        <div>
          <div className="flex gap-2">
            <Image src="/call.svg" alt="phone number" width={33} height={33} />
            <p className="text-xl text-white font-bold">(805) 524 - 5569</p>
          </div>
          <div className="flex gap-2">
            <Image src="/mail.svg" alt="Email" width={33} height={33} />
            <p className="text-xl text-white font-bold">info@mrcrs.com</p>
          </div>
        </div>
      </div>
      <div className="bg-primary flex flex-col min-[1306px]:flex-row max-[1305px]:items-center w-full ">
        <div className="flex flex-col ">
          <FooterLink href="/">Santa Paula Materials</FooterLink>
          <FooterLink href="/">MRC Rock and Sand</FooterLink>
          <FooterLink href="/">Stoneyard</FooterLink>
        </div>
        <div className="flex max-[1305px]:justify-between justify-end gap-[104px] w-full">
          <div className="flex flex-col">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/about">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </div>
          <div className="flex flex-col">
            <FooterLink href="/materials">Materials</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;
