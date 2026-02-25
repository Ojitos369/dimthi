import { localStates, indexEffect } from './localStates';
import { ViewTransition } from "react";
import { ThemeHeader } from './components/ThemeHeader';
import { ModalControls } from './components/ModalControls';
import { DummyContent } from './components/DummyContent';

export const Index = props => {
    const ls = localStates();
    indexEffect();

    return (
        <ViewTransition default="moveLeft">
            <div className={`${ls.styles.indexPage} flex w-full flex-wrap justify-center`}>
                <ThemeHeader ls={ls} />
                <ModalControls ls={ls} />
                <DummyContent ls={ls} />
            </div>
        </ViewTransition>
    )
}
