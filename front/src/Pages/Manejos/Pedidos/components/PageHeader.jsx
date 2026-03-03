import React from 'react';

export const PageHeader = ({ ls }) => {
    const { style, searchTerm, setSearchTerm } = ls;

    return (
        <div className={style.pageHeader}>
            <h2>Manejo de Pedidos</h2>
            
            <div className={style.controls}>
                <div className={style.searchBar}>
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Buscar cliente o PED-..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};
