import { localStates } from "./localStates";
import { useEffect } from 'react';
import { ViewTransition } from "react";
import { ChatBox } from "./components/ChatBox";
import { ChatControls } from "./components/ChatControls";

export const Chat = () => {
    const ls = localStates();
    useEffect(() => {
        ls.init();
    }, []);

    return (
        <ViewTransition default="moveRight">
            <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden flex flex-col">
                <header className="p-6 flex flex-col h-full">
                    <h1 className="text-2xl font-semibold mb-4">Chat</h1>
                    <ChatBox ls={ls} />
                    <ChatControls ls={ls} />
                </header>
            </div>
        </ViewTransition>
    );
};