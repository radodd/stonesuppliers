import { Button } from "./ui/button";
import Image from "next/image";
import styles from "../components/scss/MaterialFilterCards.module.scss";
import { useFilter } from "../context/FilterContext";

type MaterialFilterCardProps = {
  filter: string;
  onRemove?: (filter: string) => void;
};
export function MaterialFilterCard({
  filter,
  onRemove,
}: MaterialFilterCardProps) {
  const { filterValueList, setFilterValueList } = useFilter();

  const handleClick = () => {
    if (onRemove) onRemove(filter);

    const updatedFilterValueList = filterValueList.filter(
      (value) => value !== filter,
    );
    setFilterValueList(updatedFilterValueList);
  };

  return (
    <>
      <div className={styles.container}>
        <Button
          variant="otherFilter"
          size="filter"
          onClick={handleClick}
          className={styles.buttonDesktop}
        >
          {filter}
          {filter !== "All Materials" && (
            <Image
              src="/close.svg"
              alt=""
              width={12}
              height={12}
              style={{ width: "12px", height: "12px" }}
            />
          )}
        </Button>
        <Button
          variant="filterMobile"
          size="filterMobile"
          onClick={handleClick}
          className={styles.buttonMobile}
        >
          {filter}
          {filter !== "All Materials" && (
            <div className={styles.imageContainer}>
              <Image
                src="/close.svg"
                alt=""
                width={12}
                height={12}
                className={styles.image}
              />
            </div>
          )}
        </Button>
      </div>
    </>
  );
}
