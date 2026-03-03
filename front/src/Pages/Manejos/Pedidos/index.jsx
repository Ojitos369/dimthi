import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { DataTable } from './components/DataTable';
import { PaginationControls } from '../../../Components/PaginationControls';
import { DetailModal } from './components/DetailModal';
import { AddCommentModal } from './components/AddCommentModal';

export const ManejoPedidos = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.manejosPage}>
            <PageHeader ls={ls} />
            <DataTable ls={ls} />
            <PaginationControls pagination={ls.pagination} setPage={ls.setPage} />
            <DetailModal ls={ls} />
            <AddCommentModal ls={ls} />
        </div>
    );
};
