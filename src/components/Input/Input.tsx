import { TextField } from '@mui/material';
import type { ChangeEvent, KeyboardEvent } from 'react';
import cls from './Input.module.scss';

/**
 * Пропсы для компонента ввода
 */
interface InputProps {
    value: string; // Текущее значение
    onChange: (event: ChangeEvent<HTMLInputElement>) => void; // Обработчик изменения
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void; // Обработчик нажатия клавиш
    placeholder: string; // Подсказка в поле ввода
}

/**
 * Кастомный компонент ввода на основе Material-UI
 */
const Input = (props: InputProps) => {
    const { value, onChange, onKeyDown, placeholder } = props;
    return (
        <TextField
            className={cls.input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={value}
            id='outlined-basic'
            type='search'
            // label={placeholder}
            placeholder={placeholder}
            variant='outlined'
        />
    );
};
export default Input;
