import { useState } from 'react';
import { Header, ItemDetails, Table } from './components';
import { useLazySearchReposQuery } from './features/api/githubApi';
import { Typography } from '@mui/material';
import type { Repository } from './features/model/types/types';
import './App.scss';

/**
 * Тип для курсора пагинации - может быть строкой или null
 */
type Cursor = string | null;

/**
 * Главный компонент приложения
 */
function App() {
    // Состояние для поискового запроса
    const [searchTerm, setSearchTerm] = useState('');

    // История курсоров для пагинации
    const [cursorHistory, setCursorHistory] = useState<Cursor[]>([]);

    // Текущая страница
    const [currentPage, setCurrentPage] = useState(0);

    // Количество строк на странице
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Флаг изменения страницы
    const [isPageChanging, setIsPageChanging] = useState(false);

    // Выбранный репозиторий для детального просмотра
    const [selectedItem, setSelectedItem] = useState<Repository | null>(null);

    // Хук для ленивой загрузки репозиториев
    const [triggerSearch, { data, isLoading, isError }] =
        useLazySearchReposQuery();

    /**
     * Загружает данные для указанной страницы
     * @param page - номер страницы
     * @param newRowsPerPage - количество элементов на странице (по умолчанию текущее значение)
     */
    const loadPage = async (
        page: number,
        newRowsPerPage: number = rowsPerPage
    ) => {
        // Определяем курсор для запроса
        const cursor = page === 0 ? null : cursorHistory[page - 1];

        try {
            // Выполняем запрос
            const response = await triggerSearch({
                searchQuery: searchTerm,
                perPage: newRowsPerPage,
                cursor,
            }).unwrap(); // unwrap() для корректной обработки ошибок

            // Обновляем историю курсоров, если получен новый курсор
            if (response.pageInfo.endCursor) {
                setCursorHistory((prev) =>
                    page === 0
                        ? [response.pageInfo.endCursor]
                        : [...prev, response.pageInfo.endCursor]
                );
            }
        } catch (error) {
            console.error('Failed to fetch repos:', error);
        }
    };

    /**
     * Обработчик поиска - сбрасывает пагинацию и загружает первую страницу
     */
    const handleSearch = () => {
        setCurrentPage(0);
        loadPage(0, rowsPerPage);
    };

    /**
     * Обработчик изменения количества строк на странице
     * @param event - событие изменения
     */
    const handleChangeRowsPerPage = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newRowsPerPage = +event.target.value;
        setIsPageChanging(true);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(0);
        setCursorHistory([]);
        try {
            await loadPage(0, newRowsPerPage);
        } finally {
            setIsPageChanging(false);
        }
    };

    /**
     * Обработчик изменения страницы
     * @param event - событие изменения
     * @param newPage - новая страница
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const handleChangePage = async (event: unknown, newPage: number) => {
        setIsPageChanging(true);
        setCurrentPage(newPage);
        try {
            await loadPage(newPage);
        } finally {
            setIsPageChanging(false);
        }
    };

    /**
     * Обработчик клика по строке таблицы
     * @param repo - выбранный репозиторий
     */
    const handleRowClick = (repo: Repository) => {
        setSelectedItem(repo);
    };

    return (
        <div className='wrapper'>
            {/* Компонент заголовка с поиском */}
            <Header
                searchTerm={searchTerm}
                handleSearch={handleSearch}
                setSearchTerm={setSearchTerm}
            />

            {/* Сообщение, если ничего не найдено */}
            {data?.repos && data.repos.length === 0 && (
                <div className='no-results'>
                    По запросу "{searchTerm}" ничего не найдено
                </div>
            )}

            {/* Индикаторы загрузки и ошибки */}
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error...</p>}

            <div className='table-wrapper'>
                {!data?.repos ? (
                    // Приветственное сообщение, если данные не загружены
                    <div className='welcome-message'>
                        <Typography
                            className='welcome-message__title'
                            variant='h3'
                            gutterBottom
                        >
                            Добро пожаловать
                        </Typography>
                    </div>
                ) : (
                    <>
                        <div className='context-table'>
                            {/* Заголовок результатов поиска */}
                            <Typography variant='h2' gutterBottom>
                                Результаты поиска
                            </Typography>
                            {/* Компонент таблицы с результатами */}
                            <Table
                                data={data}
                                isLoading={isLoading}
                                page={currentPage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                onPageChange={handleChangePage}
                                isPageChanging={isPageChanging}
                                onRowClick={handleRowClick}
                            />
                        </div>
                        {/* Компонент деталей выбранного репозитория */}
                        <ItemDetails item={selectedItem} />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
