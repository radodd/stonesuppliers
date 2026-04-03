"use client";
import Image from "next/image";
import { Button } from "../ui/button";

import styles from "../scss/ContactUs.module.scss";

export default function ContactUs() {
  return (
    <div className={styles.contactContainer}>
      <div className={styles.imageContainer}>
        <Image
          src="/work_with_us.png"
          alt="Recycled rock materials being moved by heavy equipment at MRC Rock & Sand’s processing yard"
          width={1022}
          height={554}
          className={styles.image}
        />
      </div>

      <div className={styles.textContainer}>
        <h2>Interested in working with us?</h2>
        <p>Let us know your project needs and we'll be happy to assist you.</p>
        <div className="flex justify-start gap-8">
          <Button variant="outline" navigateTo="/contact">
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}
