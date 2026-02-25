import { localStates } from '../localStates';

export const FormCard = ({ ls }) => {
    const {
        style, editId, nombre, setNombre,
        comentarios, setComentarios, precioFinal, setPrecioFinal,
        cancel, handleSave
    } = ls;

    // Solo se permite editar al tener un editId (no hay creacion de cotizaciones desde aqui)
    if (!editId) return null;

    return (
        <div className={style.formCard}>
            <div className={style.formTitle}>Editar Cotización</div>
            <div className={style.formGroup}>
                <div className={style.formRow}>
                    <div>
                        <div className={style.formLabel}>Nombre (Opcional)</div>
                        <input className={style.formInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Llaveros Batman 12pzas" />
                    </div>
                    <div>
                        <div className={style.formLabel}>Precio Final Ajustado ($)</div>
                        <input type="number" className={style.formInput} value={precioFinal} onChange={e => setPrecioFinal(parseFloat(e.target.value)||0)} />
                    </div>
                </div>

                <div style={{marginTop: '0.5rem'}}>
                    <div className={style.formLabel}>Comentarios</div>
                    <textarea className={style.formInput} value={comentarios} onChange={e => setComentarios(e.target.value)} placeholder="Instrucciones especiales, dudas..."></textarea>
                </div>

                <div className={style.formActions}>
                    <button className={style.btnCancel} onClick={cancel}>Cancelar</button>
                    <button className={style.btnSave} onClick={handleSave}>Actualizar</button>
                </div>
            </div>
        </div>
    );
};
