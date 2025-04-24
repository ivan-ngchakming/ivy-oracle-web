import classNames from "classnames";

const Spinner = () => (
  <i
    className={classNames("fa fa-spinner", "animate-spin")}
    aria-hidden="true"
  ></i>
);

export default Spinner;
