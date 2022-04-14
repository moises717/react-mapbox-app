import image from '../logo.svg';

export const ReactLogo = () => {
    return (
        <img src={image} alt="react logo" style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '130px'
        }} />
    )
}
