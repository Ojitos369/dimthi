import { useEffect, useMemo } from 'react';
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
import { ManejoPerfiles } from '../Pages/Manejos/Perfiles';
import { ManejoMaquinas } from '../Pages/Manejos/Maquinas';

import { Login as LoginPage } from '../Pages/Login';
import { P404 } from '../Pages/P404';

import { store } from './store';
import { Provider } from "react-redux";
import { useStates } from '../Hooks/useStates';

import { GeneralNotification } from '../Components/Modals/general/GeneralNotification';


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

    if (!logged) {
        return (
            <div className={`text-[var(--my-minor)] bg-my-${ls.theme}`}>
                <Routes>
                    <Route path="" element={ <LoginPage /> } />
                    <Route path="test" element={ <TestPage /> } />
                    <Route path="*" element={ <LoginPage /> } />
                </Routes>
                <Theme />
                {!!s.modals?.general?.notification &&
                <GeneralNotification />}
            </div>
        )
    }

    return (
        <div className={`text-[var(--my-minor)] bg-my-${ls.theme}`}>
            <Routes>
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
                    <Route path="manejos/perfiles/*" element={ <ManejoPerfiles /> } />
                    <Route path="manejos/impresoras/*" element={ <ManejoMaquinas /> } />
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
