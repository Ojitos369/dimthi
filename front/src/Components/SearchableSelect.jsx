import { useState, useRef, useEffect } from 'react';

export const SearchableSelect = ({ options, value, onChange, placeholder = 'Seleccionar...', className, style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef(null);

    // Filter options based on search term
    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Find current selected label
    const selectedOption = options.find(opt => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', ...style }} className={className}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '0.5rem',
                    background: '#222',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: selectedOption ? 'white' : '#aaa',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: '38px'
                }}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <span>▼</span>
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: '#222',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    marginTop: '4px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    maxHeight: '250px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid #444' }}>
                        <input 
                            type="text" 
                            autoFocus 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                background: '#111',
                                border: '1px solid #555',
                                color: 'white',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {filteredOptions.length === 0 ? (
                            <div style={{ padding: '0.5rem', color: '#aaa', textAlign: 'center' }}>No hay resultados</div>
                        ) : (
                            filteredOptions.map((opt, i) => (
                                <div 
                                    key={i}
                                    onClick={() => handleSelect(opt.value)}
                                    style={{
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        background: opt.value === value ? '#3b82f6' : 'transparent',
                                        color: 'white',
                                        borderBottom: '1px solid #333'
                                    }}
                                    onMouseOver={(e) => {
                                        if (opt.value !== value) e.target.style.background = '#333';
                                    }}
                                    onMouseOut={(e) => {
                                        if (opt.value !== value) e.target.style.background = 'transparent';
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
