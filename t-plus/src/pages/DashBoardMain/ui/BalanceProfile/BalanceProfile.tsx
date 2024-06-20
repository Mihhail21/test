import { useParams } from "react-router-dom";
import styles from "./BalanceProfile.module.scss";

const BalanceProfile = () => {
  const { stationCode } = useParams();

  if (stationCode === 'academic') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Профиль баланса за ХХ.ХХ</h1>
        <div className={styles.line}></div>
        <div className={styles.outerContainer}>
          <div>
            <span>Физический метод</span>
            <div className={styles.blocks}>
              <div className={styles.leftBlock}>
                <div className={styles.verticalText}>(На отпуск)</div>
                <div className={styles.column}>
                  <span>УРУТ ээ</span>
                  <span>г/кВт*ч</span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
                <div className={styles.column}>
                  <span>УРУТ тэ</span>
                  <span>кг/кВт*ч</span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.column}>
                  <span>КПД ПГУ, %</span>
                  <span> </span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.column}>
                  <span>КПД,</span>
                  <span> котла утилизатора </span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
              </div>
            </div>
            <span>ОРГРЭС метод</span>
            <div className={styles.blocks}>
              <div className={styles.leftBlock}>
                <div className={styles.verticalText}>(На отпуск)</div>
                <div className={styles.column}>
                  <span>УРУТ ээ</span>
                  <span>г/кВт*ч</span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>

                <div className={styles.column}>
                  <span>УРУТ тэ</span>
                  <span>кг/кВт*ч</span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.column}>
                  <span>КПД парового</span>
                  <span> котла, % </span>
                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
              </div>
              <div className={styles.rightBlock}>
                <div className={styles.column}>
                  <span>КПД ВК, %</span>
                  <span> </span>

                  <span className={styles.value}>ХХХХ,Х</span>
                </div>
              </div>
            </div>

            <div className={styles.bottomBlock}>
              <div className={styles.topText}>Собственные нужды, мВт*ч</div>
              <div className={styles.bottomColumns}>
                <div className={styles.column}>
                  <span>Фактическое</span>
                  <div className={styles.textFrame}>XXXX,X</div>
                </div>
                <div className={styles.column}>
                  <span>Нормативное</span>
                  <div className={styles.textFrame}>XXXX,X</div>
                </div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ  */}
          <div className={styles.largeRightBlock}>
            <span className={styles.titleLargeRightBlock}>
              Пережоги топлива по косвенным показателям, ТУТ
            </span>
            <div className={styles.columnsContainer}>
              <div className={styles.singleColumn}>
                <span>
                  Резерв тепловой экономичности по паровым котлоагрегатам:
                </span>
                <div className={styles.line}></div>
                <ol className={styles.numberedList}>
                  <li>
                    <span>Ввиду отклонения КПД брутто котла:</span>
                    <div className={styles.formula}>В(бр)=ХХ,ХХ</div>
                  </li>
                  <li>
                    <span>ввиду отклонения температуры уходящих газов:</span>
                    <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                  </li>
                  <li>
                    <span>
                      ввиду отклонения затрат электроэнергии на нужды
                      теплофикационной установки:
                    </span>
                    <div className={styles.formula}>В(Э )=ХХ,ХХ тут</div>
                  </li>
                </ol>
              </div>
              <div className={styles.singleColumn}>
                <span>Резерв тепловой экономичности по паровой турбине:</span>
                <div className={styles.line}></div>
                <ol className={styles.numberedList}>
                  <li>
                    <span>ввиду отклонения давления пара ВД:</span>
                    <div className={styles.formula}>В(Р )=ХХ,ХХ тут</div>
                  </li>
                  <li>
                    <span>ввиду отклонения температуры пара ВД:</span>
                    <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                  </li>
                  <li>
                    <span> ввиду отклонения затрат давления в конденсаторе:</span>
                    <div className={styles.formula}>В(Р )=ХХ,ХХ тут</div>
                  </li>
                </ol>
              </div>
              <div className={styles.singleColumn}>
                <span>Резерв тепловой экономичности по газовой турбине:</span>
                <div className={styles.line}></div>
                <ol className={styles.numberedList}>
                  <li>
                    <span>ввиду отклонения КПД брутто ГТУ:</span>
                    <div className={styles.formula}>В( бр)=ХХ,ХХ тут</div>
                  </li>
                  <li>
                    <span>
                      ввиду отклонения КПД брутто ГТУ: ввиду отклонения
                      температуры уходящих газов:
                    </span>
                    <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                  </li>
                  <li>
                    <span> ввиду отклонения удельного расхода тепла нетто:</span>
                    <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Профиль баланса за ХХ.ХХ</h1>
      <div className={styles.line}></div>
      <div className={styles.outerContainer}>
        <div>
          <span>Физический метод</span>
          <div className={styles.blocks}>
            <div className={styles.leftBlock}>
              <div className={styles.verticalText}>(На отпуск)</div>
              <div className={styles.column}>
                <span>УРУТ ээ</span>
                <span>г/кВт*ч</span>
                <span className={styles.value}>ХХХХ,Х</span>
              </div>
              <div className={styles.column}>
                <span>УРУТ тэ</span>
                <span>кг/кВт*ч</span>
                <span className={styles.value}>ХХХХ,Х</span>
              </div>
            </div>
            <div className={styles.rightBlock}>
              <div className={styles.column}>
                <span>КПД</span>
                <span> паровых котлов, % </span>
                <span className={styles.value}>ХХХХ,Х</span>
              </div>
            </div>
          </div>
          <span>ОРГРЭС метод</span>
          <div className={styles.blocks}>
            <div className={styles.leftBlock}>
              <div className={styles.verticalText}>(На отпуск)</div>
              <div className={styles.column}>
                <span>УРУТ ээ</span>
                <span>г/кВт*ч</span>
                <span className={styles.value}>ХХХХ,Х</span>
              </div>

              <div className={styles.column}>
                <span>УРУТ тэ</span>
                <span>кг/кВт*ч</span>
                <span className={styles.value}>ХХХХ,Х</span>
              </div>
            </div>
          </div>

          <div className={styles.bottomBlock}>
            <div className={styles.topText}>Собственные нужды, мВт*ч</div>
            <div className={styles.bottomColumns}>
              <div className={styles.column}>
                <span>Фактическое</span>
                <div className={styles.textFrame}>XXXX,X</div>
              </div>
              <div className={styles.column}>
                <span>Нормативное</span>
                <div className={styles.textFrame}>XXXX,X</div>
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ  */}
        <div className={styles.largeRightBlock}>
          <span className={styles.titleLargeRightBlock}>
            Пережоги топлива по косвенным показателям, ТУТ
          </span>
          <div className={styles.columnsContainer}>
            <div className={styles.singleColumn}>
              <span className={styles.columnTitle}>
                Резерв тепловой экономичности по паровым котлоагрегатам:
              </span>
              <div className={styles.line}></div>
              <ol className={styles.numberedList}>
                <li>
                  <span>Ввиду отклонения КПД брутто котла:</span>
                  <div className={styles.formula}>В(бр)=ХХ,ХХ</div>
                </li>
                <li>
                  <span>ввиду отклонения температуры уходящих газов:</span>
                  <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                </li>
                <li>
                  <span>
                    ввиду отклонения затрат электроэнергии на нужды
                    теплофикационной установки:
                  </span>
                  <div className={styles.formula}>В(Э )=ХХ,ХХ тут</div>
                </li>
              </ol>
            </div>
            <div className={styles.doubleColumn}>
              <span className={styles.columnTitle}>Резерв тепловой экономичности по газовой турбине:</span>
              <div className={styles.line}></div>
              <div className={styles.columnsContainer}>
                <div className={styles.singleColumn}>
                  <ul className={styles.numberedList}>
                    <li>
                      <span>1. ввиду отклонения КПД брутто ГТУ:</span>
                      <div className={styles.formula}>В( бр)=ХХ,ХХ тут</div>
                    </li>
                    <li>
                      <span>
                      2. ввиду отклонения КПД брутто ГТУ: ввиду отклонения
                        температуры уходящих газов:
                      </span>
                      <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                    </li>
                    <li>
                      <span>3. ввиду отклонения удельного расхода тепла нетто:</span>
                      <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                    </li>
                  </ul>
                </div>
                <div className={styles.singleColumn}>
                  <ul className={styles.numberedList}>
                    <li>
                      <span>4. ввиду отклонения КПД брутто ГТУ:</span>
                      <div className={styles.formula}>В( бр)=ХХ,ХХ тут</div>
                    </li>
                    <li>
                      <span>
                        5. ввиду отклонения КПД брутто ГТУ: ввиду отклонения
                        температуры уходящих газов:
                      </span>
                      <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                    </li>
                    <li>
                      <span>6. ввиду отклонения удельного расхода тепла нетто:</span>
                      <div className={styles.formula}>В(Т )=ХХ,ХХ тут</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceProfile;
