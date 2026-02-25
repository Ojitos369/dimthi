export const FormCard = ({ ls }) => {
    const {
        style, editId, formNombre, setFormNombre,
        formDescripcion, setFormDescripcion, cancelForm, handleSave
    } = ls;

    return (
        <div className={style.formCard}>
            <div className={style.formTitle}>
                {editId ? 'Editar Modelo' : 'Nuevo Modelo'}
            </div>
            <div className={style.formGroup}>
                <div>
                    <div className={style.formLabel}>Nombre</div>
                    <input type="text" className={style.formInput}
                        placeholder="Nombre del modelo..."
                        value={formNombre}
                        onChange={e => setFormNombre(e.target.value)} />
                </div>
                <div>
                    <div className={style.formLabel}>Descripción</div>
                    <textarea className={style.formTextarea}
                        placeholder="Descripción del modelo (opcional)..."
                        value={formDescripcion}
                        onChange={e => setFormDescripcion(e.target.value)} />
                </div>
                <div className={style.formActions}>
                    <button className={style.btnCancel} onClick={cancelForm}>
                        Cancelar
                    </button>
                    <button className={style.btnSave} onClick={handleSave}>
                        {editId ? 'Actualizar' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
