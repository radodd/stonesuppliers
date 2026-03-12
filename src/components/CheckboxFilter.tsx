// src/components/CheckboxFilter.tsx
import React from "react";

type CheckboxFilterProps = {
  id: string;
  label: string;
  isChecked: boolean;
  onChange: () => void;
};

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  id,
  label,
  isChecked,
  onChange,
}) => (
  <li className="flex items-center">
    <input
      type="checkbox"
      id={id}
      onChange={onChange}
      checked={isChecked}
      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
    />
    <label htmlFor={id} className="ml-3 text-sm text-gray-600">
      {label}
    </label>
  </li>
);

export default CheckboxFilter;
