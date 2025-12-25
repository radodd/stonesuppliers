import Image from "next/image";

export default function GovAgencies() {
  return (
    <div className="section-padding bg-whitebase flex-col pl-[72px]">
      <h1 className="pb-10">Government Agencies We have partnered with</h1>
      <div className="flex gap-20 justify-around">
        <div className="">
          <Image src="/dohs.png" alt="" width={240} height={240} />
        </div>
        <div className="">
          <Image src="/doj.png" alt="" width={240} height={240} />
        </div>
        <div className="">
          <Image src="/dos.png" alt="" width={240} height={240} />
        </div>
        <div className="">
          <Image src="/gsa.png" alt="" width={240} height={240} />
        </div>
      </div>
    </div>
  );
}
