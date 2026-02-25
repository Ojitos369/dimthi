export const ThemeHeader = ({ ls }) => {
    const { theme } = ls;
    return (
        <h2 className={`text-center w-1/3 mt-3 font-bold text-3xl ${theme === 'black' ? 'text-white' : 'text-black'} reflejo`}>
            Actual theme: {theme}
        </h2>
    );
};
