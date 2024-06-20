import Loader from "../../shared/ui/Loader/Loader";
import style from "./PageLoader.module.scss";

const WidgetLoader = () => {
  return (
    <div className={style.pageLoader}>
      <Loader />
    </div>
  );
};

export default WidgetLoader;
