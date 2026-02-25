import { localStates, localEffects } from './localStates';
import { NavHeader } from './components/NavHeader';
import { ProfileCard } from './components/ProfileCard';
import { BasicControls } from './components/BasicControls';
import { DetailedCosts } from './components/DetailedCosts';
import { ModelLink } from './components/ModelLink';
import { ResultsPanel } from './components/ResultsPanel';

export const Calculadora = () => {
    const { materialType, results, style, showDetail } = localStates();
    localEffects();

    const current = materialType === 'filamento' ? results.fdm : results.resin;

    return (
        <div className={style.calculadoraPage}>
            <NavHeader />

            <div className={style.mainGrid}>
                {/* ====== CONTROLES ====== */}
                <div className={style.controlsPanel}>
                    <ProfileCard />
                    <BasicControls />
                    
                    {showDetail && (
                        <>
                            <DetailedCosts />
                            <ModelLink />
                        </>
                    )}
                </div>

                {/* ====== RESULTADOS ====== */}
                <ResultsPanel current={current} />
            </div>
        </div>
    );
};
