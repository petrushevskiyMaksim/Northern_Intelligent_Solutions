import Input from '../Input/Input';
import Button from '../Button/Button';
import type { KeyboardEvent } from 'react';
import cls from './Header.module.scss';

/**
 * Пропсы для компонента Header
 */
interface HeaderProps {
    className?: string; // Дополнительные классы
    searchTerm: string; // Текущее значение поиска
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>; // Установка значения поиска
    handleSearch: () => void; // Обработчик поиска
}

/**
 * Компонент заголовка с поиском
 */
const Header = (props: HeaderProps) => {
    const { searchTerm, setSearchTerm, handleSearch } = props;

    /**
     * Обработчик нажатия клавиши в поле ввода
     * @param e - событие клавиатуры
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    return (
        <header className={cls.header}>
            <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Введите поисковый запрос'
            />

            <Button onClick={handleSearch} text={'Искать'} />
        </header>
    );
};

export default Header;
