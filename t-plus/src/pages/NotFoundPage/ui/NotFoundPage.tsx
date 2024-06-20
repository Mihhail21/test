import styles from "./NotFoundPage.module.scss";
import Navbar from "@/widgets/Navbar/Navbar";

const NotFoundPage = () => {
  return (
    <>
      <Navbar />
      <div className={styles.notFoundPage}>Страница не найдена</div>
    </>
  );
};

export default NotFoundPage;
