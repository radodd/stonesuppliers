import { Metadata } from "next";
import styles from "../../../components/scss/Container.module.scss";

export const metadata: Metadata = {
  title: "Your Cart | MRC Rock & Sand, SPM Santa Paula Materials",
  description:
    "Review your selected materials and prepare to order from MRC Rock & Sand and SPM Santa Paula Materials.",
  alternates: {
    canonical: "https://www.stonesuppliers.net/cart",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className={styles.container}>{children}</div>
    </>
  );
}
