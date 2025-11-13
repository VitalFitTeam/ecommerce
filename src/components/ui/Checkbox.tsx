import React from "react";

type CheckboxProps = {
  labelText: string;
  isChecked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({
  labelText,
  isChecked,
  onChange,
}: CheckboxProps) {
  const id = `checkbox-${labelText.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="cursor-pointer"
      />
      <label htmlFor={id} className="ml-2 cursor-pointer text-sm">
        {labelText}
      </label>
    </div>
  );
}
