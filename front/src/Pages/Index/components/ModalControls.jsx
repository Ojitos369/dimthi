export const ModalControls = ({ ls }) => {
    const { toggleShowModal, toggleModalMode, showModal, modalMode } = ls;
    return (
        <div className='flex w-full flex-wrap justify-center mt-4'>
            <h3 className='w-full text-center'>
                Options
            </h3>
            <div className='w-1/5 m-3'>
                <button
                    className={`w-full rounded-lg px-4 py-2 ${showModal ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700' } text-white`}
                    onClick={toggleShowModal}
                >
                    Show Modal
                </button>
            </div>
            {showModal && 
            <div className='w-1/5 m-3'>
                <button
                    className='w-full rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white'
                    onClick={toggleModalMode}
                >
                    Modal Mode: {modalMode === "M" ? "Move" : "Normal"}
                </button>
            </div>}
        </div>
    );
};
