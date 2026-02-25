export const ChatControls = ({ ls }) => {
    const { isConnected, group, setGroup, handleConnect, input, setInput, sendMessage, cargando } = ls;
    return (
        <>
            <div className="mt-5 flex items-center justify-between">
                {!isConnected ? (
                    <div className="w-full flex gap-3">
                        <input
                            type="text"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            placeholder="Nombre del grupo"
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            aria-label="Grupo"
                        />
                        <button
                            onClick={handleConnect}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                        >
                            Conectar
                        </button>
                    </div>
                ) : (
                    <div className="w-full flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                            aria-label="Mensaje"
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition"
                        >
                            Enviar
                        </button>
                    </div>
                )}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>
                    {cargando && (
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Cargando...
                        </span>
                    )}
                </div>
                <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                </div>
            </div>
        </>
    );
};
