import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { ItemsGrid } from './components/ItemsGrid';
import { DetailOverlay } from './components/DetailOverlay';

export const CatResinas = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.catalogPage}>
            <PageHeader ls={ls} />
            <ItemsGrid ls={ls} />
            <DetailOverlay ls={ls} />
        </div>
    );
};
