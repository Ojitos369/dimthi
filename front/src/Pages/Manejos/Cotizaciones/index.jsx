import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { DataTable } from './components/DataTable';
import { FormCard } from './components/FormCard';
import { DetailModal } from './components/DetailModal';

export const ManejoCotizaciones = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.manejoPage}>
            <PageHeader ls={ls} />
            {ls.showForm ? <FormCard ls={ls} /> : <DataTable ls={ls} />}
            {ls.detailId && <DetailModal ls={ls} />}
        </div>
    );
};
