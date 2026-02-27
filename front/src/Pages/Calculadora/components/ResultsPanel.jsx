import { localStates } from '../localStates';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ModelLink } from './ModelLink';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const ResultsPanel = ({ current }) => {
    const { 
        style, isFilamento, maquinaName, showDetail, results, handleSaveCotizacion, themeColors,
        comentarios, setComentarios, precioFinal, setPrecioFinal,
        nombreCotizacion, setNombreCotizacion, logged,
        codigoCotizacion, setCodigoCotizacion
    } = localStates();
    const fmt = v => (v || 0).toFixed(2);

    const chartConfig = useMemo(() => {
        const d = isFilamento ? results.chartData.fdm : results.chartData.resin;
        return {
            data: {
                labels: ['Material', 'Energía', 'Máquina', 'Labor', 'Utilidad'],
                datasets: [{ 
                    label: isFilamento ? 'FDM' : 'Resina', 
                    data: d, 
                    backgroundColor: ['#7c3aed', '#ffc107', '#6c757d', '#f06292', '#198754'], 
                    borderRadius: 4 
                }],
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { tooltip: { callbacks: { label: ctx => '$' + ctx.raw.toFixed(2) } }, legend: { display: false } },
                scales: { x: { ticks: { color: '#aaa' }, grid: { color: '#333' } }, y: { ticks: { color: '#aaa' }, grid: { color: '#333' } } },
            },
        };
    }, [results, isFilamento]);

    return (
        <div className={style.resultsPanel}>
            <div className={`${style.resultCard} ${isFilamento ? style.resultBorderFdm : style.resultBorderSla}`}>
                <div className={`${style.resultHeader} ${isFilamento ? style.fdm : style.sla}`}>
                    {isFilamento ? `FDM: ${maquinaName || 'Ender 3 V3 KE'}` : `SLA: ${maquinaName || 'Photon Mono 4K'}`}
                </div>
                <div className={style.resultBody}>
                    <div className={style.resultLabel}>Precio de Venta Sugerido</div>
                    <div className={style.resultPrice}>${fmt(current.price)}</div>
                    {logged && showDetail && <div className={style.resultProfit}>Utilidad: ${fmt(current.profit)}</div>}
                    {logged && showDetail && (
                        <div className={style.resultBreakdown}>
                            <div className={style.breakdownRow}><span className={style.breakdownLabel}>{isFilamento?'Material:':'Resina+IPA:'}</span><span className={style.breakdownValue}>${fmt(current.mat)}</span></div>
                            <div className={style.breakdownRow}><span className={style.breakdownLabel}>Energía:</span><span className={style.breakdownValue}>${fmt(current.energy)}</span></div>
                            <div className={style.breakdownRow}><span className={style.breakdownLabel}>Desgaste:</span><span className={style.breakdownValue}>${fmt(current.mach)}</span></div>
                            <div className={style.breakdownRow}><span className={style.breakdownLabel}>Mano de Obra:</span><span className={style.breakdownValue}>${fmt(results.labor)}</span></div>
                        </div>
                    )}
                    
                    {logged && (
                        <div style={{marginTop: '1rem', borderTop: '1px solid #444', paddingTop: '1rem', textAlign: 'left'}}>
                            <ModelLink />
                        
                        <div style={{color: '#aaa', fontSize: '0.8rem', marginBottom: '0.25rem'}}>Nombre (Opcional)</div>
                        <input type="text" value={nombreCotizacion} onChange={e => setNombreCotizacion(e.target.value)} placeholder="Ej. Llaveros Batman" style={{width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px', marginBottom: '0.5rem'}} />
                        
                        <div style={{color: '#aaa', fontSize: '0.8rem', marginBottom: '0.25rem'}}>Asignar Código existente (Opcional)</div>
                        <input type="text" value={codigoCotizacion} onChange={e => setCodigoCotizacion(e.target.value)} placeholder="Ej. COT-A1B2C3D4" style={{width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px', marginBottom: '0.5rem'}} />
                        
                        <div style={{marginTop: '0.5rem', color: '#aaa', fontSize: '0.8rem', marginBottom: '0.25rem'}}>Precio Final (Opcional, $)</div>
                        <input type="number" value={precioFinal || ''} onChange={e => setPrecioFinal(parseFloat(e.target.value) || 0)} placeholder={`Sugerido: $${fmt(current.price)}`} style={{width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px', marginBottom: '0.5rem'}} />
                        
                        <div style={{color: '#aaa', fontSize: '0.8rem', marginBottom: '0.25rem'}}>Comentarios</div>
                        <textarea value={comentarios} onChange={e => setComentarios(e.target.value)} placeholder="Notas para la cotización..." style={{width: '100%', padding: '0.5rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px', minHeight: '60px', marginBottom: '1rem'}} />
                        
                        <button className={style.btnSaveCotizacion} onClick={handleSaveCotizacion}>
                            💾 Guardar Cotización
                        </button>
                    </div>
                    )}
                </div>
            </div>
            {logged && showDetail && (
                <div className={style.chartCard}>
                    <div className={style.chartTitle}>Desglose de Costos</div>
                    <div className={style.chartContainer}><Bar data={chartConfig.data} options={chartConfig.options} /></div>
                </div>
            )}
        </div>
    );
};
