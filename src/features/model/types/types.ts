/**
 * Интерфейс для описания репозитория GitHub
 */
export interface Repository {
    id: string; // Уникальный идентификатор
    name: string; // Название репозитория
    url: string; // URL репозитория
    primaryLanguage: { name: string } | null; // Основной язык программирования
    forks: { totalCount: number }; // Количество форков
    stargazers: { totalCount: number }; // Количество звезд
    updatedAt: string; // Дата последнего обновления
    description: string; // Описание
    licenseInfo: {
        name: string; // Название лицензии
        spdxId: string; // Идентификатор лицензии
    };
    repositoryTopics: {
        edges: Array<{
            node: RepositoryTopic;
        }>;
    };
    topics: string[]; // Темы репозитория (теги)
}

/**
 * Интерфейс для темы репозитория
 */
export interface Topic {
    name: string; // Название темы
}

/**
 * Интерфейс для связи репозитория с темой
 */
export interface RepositoryTopic {
    topic: Topic; // Тема
}

/**
 * Интерфейс для информации о странице
 */
export interface PageInfo {
    hasNextPage: boolean; // Есть ли следующая страница
    endCursor: string | null; // Курсор для пагинации
}

/**
 * Интерфейс для связи репозитория в списке
 */
export interface RepositoryEdge {
    node: Repository; // Репозиторий
    cursor: string; // Курсор для пагинации
}

/**
 * Интерфейс для результатов поиска
 */
export interface SearchResults {
    repositoryCount: number; // Общее количество репозиториев
    pageInfo: PageInfo; // Информация о странице
    edges: RepositoryEdge[]; // Список репозиториев
}

/**
 * Интерфейс для ответа GitHub GraphQL API
 */
export interface GitHubGraphQLResponse {
    data: {
        search: SearchResults; // Результаты поиска
    };
    errors?: Array<{
        message: string; // Сообщение об ошибке
        path?: string[]; // Путь к ошибке
        extensions?: Record<string, unknown>; // Дополнительные данные
    }>;
}

/**
 * Интерфейс для преобразованного ответа API
 */
export interface TransformedResponse {
    repos: Repository[]; // Список репозиториев
    totalCount: number; // Общее количество
    pageInfo: PageInfo; // Информация о странице
}
