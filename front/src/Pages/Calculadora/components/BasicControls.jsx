import { localStates } from '../localStates';

export const BasicControls = () => {
    const {
        style, isFilamento, timeHours, timeMinutes, setTimeHours, setTimeMinutes, markDirty,
        fdmWeightG, setFdmWeightG, resinVolMl, setResinVolMl
    } = localStates();

    return (
        <div className={style.card}>
            <div className={style.cardTitle}>{isFilamento ? '🔩 Filamento (FDM)' : '🧪 Resina (SLA)'}</div>
            <div className={style.fieldGroup}>
                <div>
                    <div className={style.fieldLabel}>Duración</div>
                    <div className={style.inputRow}>
                        <div className={style.inputWrapper}>
                            <input type="number" min="0" value={timeHours} onChange={e => { setTimeHours(parseFloat(e.target.value)||0); markDirty(); }} />
                            <span className={style.inputSuffix}>hrs</span>
                        </div>
                        <div className={style.inputWrapper}>
                            <input type="number" min="0" max="59" value={timeMinutes} onChange={e => { let v = parseFloat(e.target.value)||0; if(v>59)v=59; setTimeMinutes(v); markDirty(); }} />
                            <span className={style.inputSuffix}>min</span>
                        </div>
                    </div>
                </div>

                {isFilamento ? (
                    <div>
                        <div className={style.fieldLabel}>Peso (g)</div>
                        <div className={style.inputWrapper}><input type="number" value={fdmWeightG} onChange={e => { setFdmWeightG(parseFloat(e.target.value)||0); markDirty(); }} /><span className={style.inputSuffix}>g</span></div>
                    </div>
                ) : (
                    <div>
                        <div className={style.fieldLabel}>Volumen (ml)</div>
                        <div className={style.inputWrapper}><input type="number" value={resinVolMl} onChange={e => { setResinVolMl(parseFloat(e.target.value)||0); markDirty(); }} /><span className={style.inputSuffix}>ml</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};
