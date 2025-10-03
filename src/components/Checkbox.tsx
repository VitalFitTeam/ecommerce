import React from "react";

interface CheckboxProps {
  labelText: string;
  isChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  labelText,
  isChecked = false,
  onChange,
}) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="cursor-pointer"
      />
      <label className="ml-2 cursor-pointer">{labelText}</label>
    </div>
  );
};

export default Checkbox;
