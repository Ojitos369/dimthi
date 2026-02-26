import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { DataTable } from './components/DataTable';
import { FormCard } from './components/FormCard';
import { DetailModal } from './components/DetailModal';
import { PendientesTable } from './components/PendientesTable';

export const ManejoCotizaciones = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.manejoPage}>
            <PageHeader ls={ls} />
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={() => ls.setActiveTab('pendientes')}
                    style={{
                        padding: '10px 20px', background: ls.activeTab === 'pendientes' ? '#7c3aed' : '#333',
                        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    Nuevas Peticiones ({ls.pendientes.length})
                </button>
                <button 
                    onClick={() => ls.setActiveTab('historial')}
                    style={{
                        padding: '10px 20px', background: ls.activeTab === 'historial' ? '#7c3aed' : '#333',
                        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    Historial de Cotizadas
                </button>
            </div>

            {ls.showForm ? (
                <FormCard ls={ls} />
            ) : (
                ls.activeTab === 'pendientes' ? <PendientesTable ls={ls} /> : <DataTable ls={ls} />
            )}
            
            {ls.detailId && <DetailModal ls={ls} />}
        </div>
    );
};
