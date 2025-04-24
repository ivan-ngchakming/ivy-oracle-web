import { Switch } from "@headlessui/react";
import classNames from "classnames";

export type ToggleButtonSize = "large" | "medium" | "small";

export type ToggleButtonProps = {
  size?: ToggleButtonSize;
  toggled: boolean;
  onChange?: (checked: boolean) => void;
};

const getBackgroundSizeClassNames = (size: ToggleButtonSize) => {
  switch (size) {
    case "large":
      return "h-[38px] w-[74px]";
    case "medium":
      return "h-[28px] w-[48px]";
    default:
      return "h-[38px] w-[74px]";
  }
};

const getCircleSizeClassNames = (size: ToggleButtonSize) => {
  switch (size) {
    case "large":
      return "h-[38px] w-[74px]";
    case "medium":
      return "h-[24px] w-[24px]";
    default:
      return "h-[38px] w-[74px]";
  }
};

const getCircleTranslateClassName = (size: ToggleButtonSize) => {
  switch (size) {
    case "large":
      return "translate-x-9";
    case "medium":
      return "translate-x-5";
    default:
      return "translate-x-9";
  }
};

const ToggleButton = ({
  size = "medium",
  toggled,
  onChange,
}: ToggleButtonProps) => {
  return (
    <Switch
      checked={toggled}
      onChange={onChange}
      className={classNames(
        toggled ? "bg-teal-900" : "bg-teal-700",
        "relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75",
        getBackgroundSizeClassNames(size)
      )}
    >
      <span
        aria-hidden="true"
        className={classNames(
          toggled ? getCircleTranslateClassName(size) : "translate-x-0",
          "pointer-events-none inline-block transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
          getCircleSizeClassNames(size)
        )}
      />
    </Switch>
  );
};

export default ToggleButton;
