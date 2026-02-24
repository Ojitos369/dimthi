import { localStates, localEffects } from './localStates';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const Modelos = () => {
    const {
        style, modelos,
        showForm, editId,
        formNombre, setFormNombre,
        formDescripcion, setFormDescripcion,
        openNewForm, openEditForm, cancelForm,
        handleSave, handleDelete,
    } = localStates();
    localEffects();

    return (
        <div className={style.modelosPage}>
            {/* Header */}
            <div className={style.pageHeader}>
                <div className={style.pageTitle}>📐 Gestión de Modelos</div>
                <button className={style.btnNew} onClick={openNewForm}>
                    ＋ Nuevo Modelo
                </button>
            </div>

            {/* Form */}
            {showForm && (
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
            )}

            {/* Table */}
            <div className={style.modelosTable}>
                <div className={style.tableHeader}>
                    <span>Nombre</span>
                    <span>Descripción</span>
                    <span>Fecha</span>
                    <span></span>
                </div>
                {modelos.length === 0 && (
                    <div className={style.emptyState}>
                        No hay modelos registrados.
                    </div>
                )}
                {modelos.map(m => (
                    <div key={m.id} className={style.tableRow}>
                        <span className={style.truncate}>{m.nombre}</span>
                        <span className={style.truncate}>{m.descripcion || '—'}</span>
                        <span>{formatDate(m.created_at)}</span>
                        <div className={style.tableActions}>
                            <button className={style.btnEdit}
                                onClick={e => { e.stopPropagation(); openEditForm(m); }}>
                                ✏️
                            </button>
                            <button className={style.btnDelete}
                                onClick={e => { e.stopPropagation(); handleDelete(m.id); }}>
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
