import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import styles from "../components/scss/MaterialCard.module.scss";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imagePrimary: string;
  imagePath: string[];
  company: string[];
  color: string[];
  uses: string[];
  category: string[];
};
export function ProductCard({
  id,
  slug,
  name,
  description,
  imagePrimary,
  imagePath,
  company,
  color,
  uses,
  category,
}: ProductCardProps) {
  return (
    <>
      <Separator
        orientation="horizontal"
        decorative={true}
        className={styles.separator}
      />
      <Link href={`/materials/${slug}`} key={id} prefetch={false}>
        <Card className={styles.card}>
          <div className={styles.imageWrapper}>
            <Image
              src={
                imagePrimary !== null
                  ? imagePrimary
                  : "/image_not_available.svg"
              }
              alt={name}
              width={325}
              height={325}
              className={styles.image}
            />
          </div>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>{name}</CardTitle>
            <CardDescription className={styles.cardDescription}>
              {description}
            </CardDescription>
            <CardContent className={styles.cardContent}>
              {uses === null ? (
                <>
                  <CardInfoRow label="Categories" value={category.join(", ")} />
                  <CardInfoRow label="Color" value={color?.join(", ")} />
                </>
              ) : (
                <>
                  <CardInfoRow label="Colors" value={color?.join(", ")} />
                  {uses[0] === "TBD" ? (
                    <></>
                  ) : (
                    <CardInfoRow label="Uses" value={uses?.join(", ")} />
                  )}
                </>
              )}

              <CardInfoRow label="Company" value={company.join(", ")} />
            </CardContent>
          </CardHeader>
        </Card>
      </Link>
    </>
  );
}

type CardInfoRowProps = {
  label: string;
  value: string;
};

const CardInfoRow: React.FC<CardInfoRowProps> = ({ label, value }) => {
  return (
    <div className={styles.infoContainer}>
      <h3>{label}:</h3>
      <span>{value}</span>
    </div>
  );
};
