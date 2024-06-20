import SchemaPage from "@/pages/SchemaPage/ui/SchemaPage";
import styles from "./WrapperSchemaPage.module.scss";
import { useLocation } from "react-router-dom";

const WrapperSchemaPage: React.FC = () => {
 const location = useLocation();
 const scaleX = location.pathname === "/sverdlovsk/novosverdlovskaya" ? 0.62 : 0.9;
 const scaleY = location.pathname === "/sverdlovsk/novosverdlovskaya" ? 0.62 : 0.8;


 return (
   <div className={styles.container}>
     <SchemaPage
       scaleX={scaleX}
       scaleY={scaleY}
       main={"main"}
       height={620}
       width={1205}
     />
   </div>
 );
};

export default WrapperSchemaPage;
