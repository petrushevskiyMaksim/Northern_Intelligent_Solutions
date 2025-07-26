import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type { Repository } from '../../features/model/types/types';
import type { TransformedResponse } from '../../features/model/types/types';
import { useMemo, useState } from 'react';
import { TableSortLabel } from '@mui/material';

/**
 * Получает значение из объекта Repository по имени колонки
 * @param columnId - идентификатор колонки
 * @param row - объект Repository
 * @returns значение поля или null
 */
const getValue = (columnId: string, row: Repository) => {
    switch (columnId) {
        case 'name':
            return row.name;
        case 'primaryLanguage':
            return row.primaryLanguage?.name || 'N/A';
        case 'forks':
            return row.forks.totalCount;
        case 'stargazers':
            return row.stargazers.totalCount;
        case 'updatedAt':
            return row.updatedAt;
        default:
            return null;
    }
};
/**
 * Интерфейс для описания колонки таблицы
 */
interface Column {
    id: keyof Repository;
    label: string;
    minWidth?: number;
    fontWeight?: string;
    align?: 'left';
    format?: (value: string | number) => string;
    numeric?: boolean;
}
/**
 * Конфигурация колонок таблицы
 */
const columns: readonly Column[] = [
    { id: 'name', label: 'Название', minWidth: 170, fontWeight: 'bold' },
    { id: 'primaryLanguage', label: 'Язык', minWidth: 100, fontWeight: 'bold' },
    {
        id: 'forks',
        label: 'Число форков',
        minWidth: 170,
        align: 'left',
        numeric: true,
        fontWeight: 'bold',
    },
    {
        id: 'stargazers',
        label: 'Число звезд',
        minWidth: 170,
        align: 'left',
        numeric: true,
        fontWeight: 'bold',
    },
    {
        id: 'updatedAt',
        label: 'Дата обновления',
        minWidth: 170,
        align: 'left',
        format: (value: string | number) =>
            new Date(value).toLocaleDateString('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            }),
        fontWeight: 'bold',
    },
];

type Order = 'asc' | 'desc'; // Тип для направления сортировки
/**
 * Пропсы для компонента таблицы
 */
interface TableProps {
    data: TransformedResponse; // Данные для отображения
    isLoading?: boolean; // Флаг загрузки
    page: number; // Текущая страница
    rowsPerPage: number; // Количество строк на странице
    onPageChange: (event: unknown, newPage: number) => void; // Обработчик изменения страницы
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Обработчик изменения количества строк
    isPageChanging?: boolean; // Флаг изменения страницы
    onRowClick?: (repo: Repository) => void; // Обработчик клика по строке
}

/**
 * Стабильная сортировка массива с учетом индексов
 * @param array - массив для сортировки
 * @param comparator - функция сравнения
 * @returns отсортированный массив
 */
function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

/**
 * Создает компаратор для сортировки
 * @param order - направление сортировки
 * @param orderBy - поле для сортировки
 * @returns функция сравнения
 */
function getComparator<Key extends keyof Repository>(
    order: Order,
    orderBy: Key
): (a: Repository, b: Repository) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Компаратор для сортировки по убыванию
 * @param a - первый элемент
 * @param b - второй элемент
 * @param orderBy - поле для сортировки
 * @returns число для определения порядка
 */
function descendingComparator<T extends Repository>(
    a: T,
    b: T,
    orderBy: keyof Repository
) {
    const getComparableValue = (repo: Repository, key: keyof Repository) => {
        switch (key) {
            case 'forks':
                return repo.forks.totalCount;
            case 'stargazers':
                return repo.stargazers.totalCount;
            case 'primaryLanguage':
                return repo.primaryLanguage?.name || '';
            default:
                return repo[key];
        }
    };

    const aValue = getComparableValue(a, orderBy);
    const bValue = getComparableValue(b, orderBy);

    if (bValue === undefined || bValue === null) return -1;
    if (aValue === undefined || aValue === null) return 1;
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
}

/**
 * Компонент таблицы с фиксированным заголовком и пагинацией
 */
export default function StickyHeadTable(props: TableProps) {
    const {
        data,
        isLoading,
        page,
        rowsPerPage,
        onRowsPerPageChange,
        onPageChange,
        isPageChanging = false,
        onRowClick,
    } = props;

    const { repos, totalCount } = data;

    // Состояние сортировки
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof Repository | null>(null);

    /**
     * Обработчик изменения сортировки
     * @param property - поле для сортировки
     */
    const handleRequestSort = (property: keyof Repository) => {
        // Если уже сортируем по этому полю
        if (orderBy === property) {
            // Если это второй клик (меняем направление)
            if (order === 'asc') {
                setOrder('desc');
            }
            // Если третий клик - сбрасываем сортировку
            else {
                setOrderBy(null);
                setOrder('asc');
            }
        }
        // Если это новое поле - сортируем по возрастанию
        else {
            setOrderBy(property);
            setOrder('asc');
        }
    };

    // Отсортированные репозитории
    const sortedRepos = useMemo(() => {
        if (!orderBy) return repos; // Если сортировка не задана, возвращаем исходный массив
        return stableSort(repos, getComparator(order, orderBy));
    }, [repos, order, orderBy]);

    return (
        <Paper
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100vh', // Максимальная высота - не больше экрана
                overflow: 'hidden',
            }}
        >
            <TableContainer
                sx={{
                    flex: '1 1 auto', // Занимает все доступное пространство
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 64px)', // Оставляем место для пагинации
                }}
            >
                <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        fontWeight: column.fontWeight,
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === column.id}
                                        direction={
                                            orderBy === column.id
                                                ? order
                                                : 'asc'
                                        }
                                        onClick={() =>
                                            handleRequestSort(column.id)
                                        }
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRepos.map((repo) => {
                            return (
                                <TableRow
                                    hover
                                    role='checkbox'
                                    tabIndex={-1}
                                    key={repo.id}
                                    onClick={() =>
                                        onRowClick && onRowClick(repo)
                                    }
                                >
                                    {columns.map((column) => {
                                        // Получаем значение в зависимости от column.id

                                        const value = getValue(column.id, repo);

                                        return (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {value !== undefined &&
                                                value !== null
                                                    ? column.format
                                                        ? column.format(value)
                                                        : value
                                                    : ''}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                disabled={isLoading || isPageChanging} // Отключаем при загрузке
                backIconButtonProps={{
                    'aria-label': 'previous page',
                    disabled: isLoading || isPageChanging || page === 0,
                }}
                nextIconButtonProps={{
                    'aria-label': 'next page',
                    disabled:
                        isLoading ||
                        isPageChanging ||
                        (page + 1) * rowsPerPage >= totalCount,
                }}
                SelectProps={{
                    inputProps: { 'aria-label': 'Rows per page' },
                    disabled: isLoading || isPageChanging,
                }}
            />
        </Paper>
    );
}
