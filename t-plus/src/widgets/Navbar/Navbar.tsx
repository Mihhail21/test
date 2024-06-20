import { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.scss";
import Avatar from "../../shared/assets/icons/avatar.svg";
import Home from "../../shared/assets/icons/home.svg";
import { Link, useParams } from "react-router-dom";
import ArrowLeft from "../../shared/assets/icons/arrow_left.svg";
import { useAppSelector } from "@/shared/model/useReduxHooks";
import { IBranch, IStation, IStationCategory, IStationSchema } from "@/interface/stations";

interface IPageMeta {
  isIndex: boolean;
  title: string;
}

const pageMetaMap: { [key: string]: IPageMeta } = {
  index: {
    isIndex: true,
    title: "Цифровой портал",
  },
  dashboard: {
    isIndex: false,
    title: "Общая информация",
  },
  schema: {
    isIndex: false,
    title: "",
  },
};

const Navbar = () => {
  const branches: IBranch[] = useAppSelector((state) => state.branches)?.items || [];
  const { branchCode, stationCode, schemaCode } = useParams();
  const [pageMeta, setPageMeta] = useState<IPageMeta | null>(null);
  const [branch, setBranch] = useState<IBranch | null>(null);
  const [station, setStation] = useState<IStation | null>(null);
  const [secondDropdown, setSecondDropdown] = useState<string | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState<string | null>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const findSchemaRecursively = (schemas: IStationSchema[], schemaCode: string): IStationSchema | null => {
    for (const schema of schemas) {
      if (schema.code === schemaCode) {
        return schema;
      }
      if (schema.subSchemas) {
        const foundSubSchema = findSchemaRecursively(schema.subSchemas, schemaCode);
        if (foundSubSchema) {
          return foundSubSchema;
        }
      }
    }
    return null;
  };

  const getPageMeta = () => {
    if (branchCode && stationCode) {
      const foundBranch = branches.find((b: IBranch) => b.code === branchCode) || null;
      const foundStation = foundBranch
        ? foundBranch.stations.find((s: IStation) => s.code === stationCode) || null
        : null;

      setBranch(foundBranch);
      setStation(foundStation);
      if (!schemaCode) {
        return pageMetaMap.dashboard;
      }

      const foundCategory = foundStation
        ? foundStation.categories.find((category) => {
            return !!findSchemaRecursively(category.schemas, schemaCode);
          }) || null
        : null;

      const foundSchema = foundCategory ? findSchemaRecursively(foundCategory.schemas, schemaCode) : null;

      return {
        ...pageMetaMap.schema,
        title: foundSchema?.title || "название не найдено",
      };
    }

    return pageMetaMap.index;
  };

  useEffect(() => {
    const meta = getPageMeta();
    setPageMeta(meta);
  }, [branches, schemaCode]);

  return (
    <div className={styles.navbar} ref={navbarRef}>
      {!pageMeta?.isIndex && (
        <>
          <Link to={"/"}>
            <img src={Home} className={styles.imgHome} alt="home" />
          </Link>
          <span className={styles.sidebar}>
            <img className={styles.img} src={ArrowLeft} alt="arrowLeft" />
            &nbsp;&nbsp;
            {!schemaCode && <>{station?.title || ""}</>}
            {branch && station && schemaCode && (
              <Link to={`/${branch.code}/${station.code}`}>{station?.title || ""}</Link>
            )}
            <img className={styles.img} src={ArrowLeft} alt="arrowLeft" />
          </span>
          <div className={styles.leftSection}>
            {branch &&
              station?.categories &&
              station.categories
                .filter((category) => category.code !== "hidden") // Исключаем категорию "скрытые" из отображения
                .map((category: IStationCategory) => {
                  return (
                    <div
                      key={`${station.code}-${category.code}`}
                      className={styles.dropdown}
                      onMouseEnter={() => setSecondDropdown(category.code)}
                      onMouseLeave={() => setSecondDropdown(null)}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryDropdownOpen(categoryDropdownOpen === category.code ? null : category.code);
                        }}
                      >
                        {category.title}
                      </div>
                      {secondDropdown === category.code && (
                        <div className={styles.dropdownContent}>
                          {category.schemas.map((schema: IStationSchema) => {
                            if (schema.subSchemas) {
                              return (
                                <div key={schema.id}>
                                  <div className={styles.title}>{schema.title}</div>
                                  <div className={styles.subDropdownContent}>
                                    {schema.subSchemas.map((subSchema) => (
                                      <Link
                                        to={`/${branch.code}/${station.code}/${subSchema.code}`}
                                        key={`${station.code}-${category.code}-${subSchema.code}`}
                                      >
                                        {subSchema.title}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <Link
                                  to={`/${branch.code}/${station.code}/${schema.code}`}
                                  key={`${station.code}-${category.code}-${schema.code}`}
                                >
                                  {schema.title}
                                </Link>
                              );
                            }
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
          </div>
        </>
      )}
      <div className={styles.centerText}>{pageMeta?.title || ""}</div>
      <div className={styles.rightSection}>
        <div className={styles.fields}>
          <span>Фамилия И.О.</span>
          <span>Должность</span>
        </div>
        <img src={Avatar} alt="avatar" />
      </div>
    </div>
  );
};

export default Navbar;
