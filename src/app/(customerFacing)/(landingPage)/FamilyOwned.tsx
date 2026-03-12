import Image from "next/image";
import { Button } from "@/components/ui/button";

import styles from "@/scss/FamilyOwned.module.scss";

export default function FamilyOwned() {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.textContainer}>
        <h2>We are family-owned.</h2>
        <p>
          From the shores of Croatia, SPM Santa Paula Materials is a family run
          company committed to recycling and integrating natural materials
          through function and design.
        </p>
        <div className="justify-start">
          <Button variant="outline" size="default" navigateTo="/about">
            About Us
          </Button>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/family_owned.png"
          alt="Small boat floating on the Adriatic Sea along the coast of Croatia, honoring the Croatian heritage of SPM Santa Paula Materials and their use of Croatian limestone."
          width={822}
          height={529}
          className={styles.image}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
}
