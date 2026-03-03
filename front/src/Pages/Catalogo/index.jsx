import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { ModelosGrid } from './components/ModelosGrid';
import { DetailModal } from './components/DetailModal';
import { PendingCartWidget } from './components/PendingCartWidget';
import { PendingOrderWidget } from './components/PendingOrderWidget';
import { AddModeloModal } from './components/AddModeloModal';
import { RequestQuoteModal } from './components/RequestQuoteModal';
import { PaginationControls } from '../../Components/PaginationControls';

export const Catalogo = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.catalogoPage}>
            <PageHeader ls={ls} />
            <ModelosGrid ls={ls} />
            <PaginationControls pagination={ls.pagination} setPage={ls.setPage} />
            <DetailModal ls={ls} />
            <PendingCartWidget ls={ls} />
            <PendingOrderWidget ls={ls} />
            <AddModeloModal ls={ls} />
            <RequestQuoteModal ls={ls} />
        </div>
    );
};
