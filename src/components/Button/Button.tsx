import Button from '@mui/material/Button';

/**
 * Пропсы для компонента кнопки
 */
interface ButtonProps {
    onClick: () => void; // Обработчик клика
    text: string; // Текст кнопки
}

/**
 * Кастомная кнопка на основе Material-UI
 */
const _Button = (props: ButtonProps) => {
    const { text, onClick } = props;
    return (
        <Button
            sx={{ marginLeft: '20px' }}
            onClick={onClick}
            variant='contained'
        >
            {text}
        </Button>
    );
};

export default _Button;
