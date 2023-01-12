import { ChangeEventHandler } from "react";

export interface InputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const Input = ({ label, placeholder, value, onChange }: InputProps) => {
  return (
    <div className="mx-2">
      <label
        htmlFor="exampleFormControlInput1"
        className="form-label inline-block text-gray-700 pl-2"
      >
        {label}
      </label>
      <input
        type="text"
        className="
        form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
      "
        id="exampleFormControlInput1"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
