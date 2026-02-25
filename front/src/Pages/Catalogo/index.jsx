import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { ModelosGrid } from './components/ModelosGrid';
import { DetailModal } from './components/DetailModal';

export const Catalogo = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.catalogoPage}>
            <PageHeader ls={ls} />
            <ModelosGrid ls={ls} />
            <DetailModal ls={ls} />
        </div>
    );
};
