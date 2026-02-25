import { useState, useEffect, useRef } from 'react';
import { createState } from '../../../Hooks/useStates';
import style from './styles/index.module.scss';
import styleGen from '../styles/index.module.scss';

export const localStates = props => {
    const [titulo, setTitulo] = createState(['page', 'title'], "");
    const [actualPage, setActualPage] = createState(['page', 'actual'], "");
    
    const [messages, setMessages] = useState([]);
    const [actualMessage, setActualMessage] = useState("");
    const [input, setInput] = useState('');
    const [group, setGroup] = useState('gen');
    const [isConnected, setIsConnected] = useState(false);
    const [cargando, setCargando] = useState(false);

    const socket = useRef(null);
    const clientId = useRef(Date.now());

    const init = () => {
        setTitulo("chat");
        setActualPage("chat");
    }

    useEffect(() => {
        if (!isConnected) return;

        const wsUrl = `ws://localhost:8369/api/ws/${group}?clientId=${clientId.current}`;
        socket.current = new WebSocket(wsUrl);

        console.log('Intentando conectar al WebSocket...');

        socket.current.onopen = () => {
            console.log('¡Conectado al WebSocket!');
        };

        socket.current.onmessage = (event) => {
            const message = event.data;

            if (message !== "-done-") {
                setActualMessage(prevActualMessage => prevActualMessage + message);
            } else {
                setActualMessage(prevActualMessage => {
                    setMessages(prevMessages => [...prevMessages, prevActualMessage]);
                    return "";
                });
            }
            setCargando(false);
        };

        socket.current.onclose = () => {
            console.log('Desconectado del WebSocket.');
            setIsConnected(false);
        };

        socket.current.onerror = (error) => {
            console.error('Error en el WebSocket:', error);
        };

        return () => {
            console.log('Cerrando conexión WebSocket.');
            socket.current.close();
        };
    }, [isConnected, group]);

    const handleConnect = () => {
        setIsConnected(true);
    };

    const sendMessage = () => {
        if (socket.current?.readyState === WebSocket.OPEN && input) {
            setMessages(prev => [...prev, `Yo: ${input}`]);
            socket.current.send(input);
            setInput('');
            setCargando(true);
        }
    };

    return { 
        style, styleGen,
        init,
        messages, actualMessage, input, setInput,
        group, setGroup, isConnected, cargando,
        handleConnect, sendMessage
    }
}
