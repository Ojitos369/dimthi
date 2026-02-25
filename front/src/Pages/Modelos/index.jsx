import { localStates, localEffects } from './localStates';
import { PageHeader } from './components/PageHeader';
import { FormCard } from './components/FormCard';
import { ModelosTable } from './components/ModelosTable';

export const Modelos = () => {
    const ls = localStates();
    localEffects();

    return (
        <div className={ls.style.modelosPage}>
            <PageHeader ls={ls} />
            {ls.showForm && <FormCard ls={ls} />}
            <ModelosTable ls={ls} />
        </div>
    );
};
