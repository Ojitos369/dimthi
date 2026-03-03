import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { FormCard } from './components/FormCard';
import { DataTable } from './components/DataTable';
import { PaginationControls } from '../../../Components/PaginationControls';

export const ManejoModelos = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.manejoPage}>
            <PageHeader ls={ls} />
            {ls.showForm && <FormCard ls={ls} />}
            <DataTable ls={ls} />
            <PaginationControls pagination={ls.pagination} setPage={ls.setPage} />
        </div>
    );
};
