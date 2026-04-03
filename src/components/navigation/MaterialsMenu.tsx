import Image from "next/image";
import Link from "next/link";

import { NavigationMenuContent } from "@/components/ui/navigation-menu";

import { MaterialMenuGroup, MaterialGroup } from "./menuConfig";

interface Props {
  groups: MaterialMenuGroup[];
  activeGroup: MaterialGroup | null;
  setActiveGroup: (key: MaterialGroup) => void;
  menuHeight: string;
  onFilterSelect: (value: string) => void;
  onMaterialClick: (name: string) => void;
}

export default function MaterialsMenu({
  groups,
  activeGroup,
  setActiveGroup,
  menuHeight,
  onFilterSelect,
  onMaterialClick,
}: Props) {
  const active = groups.find((g) => g.key === activeGroup);

  return (
    <NavigationMenuContent
      className={`${menuHeight}  flex bg-whitebase rounded-[10px] p-4 absolute top-[-50px]`}
    >
      <div className="w-[260px]">
        <Link href="/materials" className="block font-bold text-lg mb-4">
          Shop All Materials
        </Link>

        <ul className="flex flex-col gap-2">
          {groups.map((group) => (
            <li
              key={group.key}
              onMouseEnter={() => setActiveGroup(group.key)}
              onClick={() => onFilterSelect(group.filterValue)}
              className="cursor-pointer p-3 rounded hover:bg-tanbase"
            >
              <div className="font-semibold">{group.title}</div>
              <p className="text-sm text-secondary-text">{group.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div className="ml-6 flex gap-6">
          <div className="w-[260px]">
            <Image src={active.logo} alt="" width={80} height={60} />
            <h3 className="font-semibold text-xl mt-2">{active.title}</h3>
            <p className="text-sm">{active.description}</p>
          </div>

          <ul className="flex flex-col gap-2">
            {active.items.map((item) => (
              <li
                key={item}
                onClick={() => onMaterialClick(item)}
                className="cursor-pointer text-lg hover:text-primary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </NavigationMenuContent>
  );
}
