import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { cambiarThema } from '../Core/helper';
import { Theme } from '../Components/Theme';

import { Main as MainPage } from '../Pages/Main';
import { Test as TestPage } from '../Pages/Test';
import { Calculadora as CalculadoraPage } from '../Pages/Calculadora';
import { Catalogo as CatalogoPage } from '../Pages/Catalogo';
import { CatFilamentos } from '../Pages/Catalogos/Filamentos';
import { CatResinas } from '../Pages/Catalogos/Resinas';
import { CatMaquinas } from '../Pages/Catalogos/Maquinas';
import { Modelos as ModelosPage } from '../Pages/Modelos';
import { ManejoFilamentos } from '../Pages/Manejos/Filamentos';
import { ManejoResinas } from '../Pages/Manejos/Resinas';
import { ManejoModelos } from '../Pages/Manejos/Modelos';
import { ManejoCotizaciones } from '../Pages/Manejos/Cotizaciones';
import { ManejoPerfiles } from '../Pages/Manejos/Perfiles';
import { ManejoMaquinas } from '../Pages/Manejos/Maquinas';
import { ManejoCompras } from '../Pages/Manejos/Compras';

import { SalesDashboard as VentasDashboard } from '../Pages/Dashboards/Ventas';
import { ProductionDashboard } from '../Pages/Dashboards/Produccion';
import { InventoryDashboard } from '../Pages/Dashboards/Inventario';

import { Login as LoginPage } from '../Pages/Login';
import { P404 } from '../Pages/P404';

import { store } from './store';
import { Provider } from "react-redux";
import { useStates } from '../Hooks/useStates';

import { GeneralNotification } from '../Components/Modals/general/GeneralNotification';


const GlobalLoader = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const show = () => setLoading(true);
        const hide = () => setLoading(false);
        window.addEventListener('show_global_loader', show);
        window.addEventListener('hide_global_loader', hide);
        return () => {
            window.removeEventListener('show_global_loader', show);
            window.removeEventListener('hide_global_loader', hide);
        };
    }, []);

    if (!loading) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ padding: '20px 40px', background: '#111', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid rgba(124, 58, 237, 0.2)', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#ccc', fontSize: '0.9rem', fontWeight: 500 }}>Cargando...</span>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

function AppUI() {
    const { ls, s, f } = useStates();
    const logged = useMemo(() => s.auth?.logged, [s.auth?.logged]);

    useEffect(() => {
        cambiarThema(ls?.theme);
    }, [ls?.theme]);

    useEffect(() => {
        f.app.getModes();
    }, []);

    useEffect(() => {
        f.auth.validateLogin();
    }, [location.href]);

    return (
        <div className={`text-[var(--my-minor)] bg-my-${ls.theme}`}>
            <GlobalLoader />
            <Routes>
                <Route path="login" element={ <LoginPage /> } />
                <Route path="test" element={ <TestPage /> } />
                <Route path="" element={ <MainPage /> } >
                    <Route path="" element={ <CatalogoPage /> } />
                    {/* Catalogos */}
                    <Route path="catalogos/modelos/*" element={ <CatalogoPage /> } />
                    <Route path="catalogos/filamentos/*" element={ <CatFilamentos /> } />
                    <Route path="catalogos/resinas/*" element={ <CatResinas /> } />
                    <Route path="catalogos/impresoras/*" element={ <CatMaquinas /> } />
                    {/* Calculadora */}
                    <Route path="calculadora/*" element={ <CalculadoraPage /> } />
                    {/* Manejos */}
                    <Route path="manejos/filamentos/*" element={ <ManejoFilamentos /> } />
                    <Route path="manejos/resinas/*" element={ <ManejoResinas /> } />
                    <Route path="manejos/modelos/*" element={ <ManejoModelos /> } />
                    <Route path="manejos/cotizaciones/*" element={ <ManejoCotizaciones /> } />
                    <Route path="manejos/perfiles/*" element={ <ManejoPerfiles /> } />
                    <Route path="manejos/impresoras/*" element={ <ManejoMaquinas /> } />
                    <Route path="manejos/compras/*" element={ <ManejoCompras /> } />
                    
                    <Route path="dashboards/ventas/*" element={ <VentasDashboard /> } />
                    <Route path="dashboards/produccion/*" element={ <ProductionDashboard /> } />
                    <Route path="dashboards/inventario/*" element={ <InventoryDashboard /> } />
                    
                    <Route path="*" element={ <P404 /> } />
                </Route>
            </Routes>

            {!!s.modals?.general?.notification &&
            <GeneralNotification />}
        </div>
    );
}

function App(props) {
    return (
        <Provider store={store}>
            <AppUI />
        </Provider>
    );
}

export default App;
