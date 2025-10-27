import React from "react";

interface CheckboxProps {
  labelText: string;
  isChecked?: boolean;
  // use built-in React handler type
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
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
