import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { ModelosGrid } from './components/ModelosGrid';
import { DetailModal } from './components/DetailModal';
import { PendingCartWidget } from './components/PendingCartWidget';
import { AddModeloModal } from './components/AddModeloModal';

export const Catalogo = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.catalogoPage}>
            <PageHeader ls={ls} />
            <ModelosGrid ls={ls} />
            <DetailModal ls={ls} />
            <PendingCartWidget ls={ls} />
            <AddModeloModal ls={ls} />
        </div>
    );
};
