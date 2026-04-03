import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Image src="/loading.svg" alt="Loading material..." width={1000} height={1000} priority style={{ width: "auto", height: "auto" }} />
    </div>
  );
}
