import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
    GitHubGraphQLResponse,
    TransformedResponse,
} from '../model/types/types';

/**
 * API для работы с GitHub GraphQL
 * Содержит endpoints для поиска репозиториев
 */
export const githubApi = createApi({
    // Уникальный ключ для редюсера
    reducerPath: 'githubApi',
    // Настройка базового запроса
    baseQuery: fetchBaseQuery({
        // Базовый URL для запросов
        baseUrl: 'https://api.github.com/graphql',
        // Подготовка заголовков запроса
        prepareHeaders: (headers) => {
            // Добавляем токен авторизации из переменных окружения
            headers.set(
                'Authorization',
                `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`
            );
            return headers;
        },
    }),
    // Определение endpoints API
    endpoints: (builder) => ({
        /**
         * Endpoint для поиска репозиториев
         * @param searchQuery - строка поиска
         * @param perPage - количество результатов на странице
         * @param cursor - курсор для пагинации
         * @returns Promise с результатами поиска
         */
        searchRepos: builder.query<
            TransformedResponse,
            {
                searchQuery: string;
                perPage: number;
                cursor?: string | null;
            }
        >({
            // Формирование GraphQL запроса
            query: ({ searchQuery, perPage, cursor }) => ({
                url: '',
                method: 'POST',
                body: {
                    query: `
            query ($searchQuery: String!, $perPage: Int!, $cursor: String) {
                search(
                    query: $searchQuery
                    type: REPOSITORY
                    first: $perPage
                    after: $cursor
                    ) {
                    repositoryCount
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        node {
                            ... on Repository {
                                id
                                name
                                url
                                primaryLanguage { name }
                                forks { totalCount }
                                stargazers { totalCount }
                                updatedAt
                                description 
                                licenseInfo {
                                    name
                                    spdxId
                                }
                                    repositoryTopics(first: 10) {
                                    edges {
                                        node {
                                            topic {
                                                name
                                            }
                                        }
                                    }
                                }
                    }
                  }
                    cursor
                }
              }
            }
          `,
                    // Параметры запроса
                    variables: {
                        searchQuery: `${searchQuery} in:name`,
                        perPage,
                        cursor,
                    },
                },
            }),
            // Преобразование ответа от API
            transformResponse: (
                response: GitHubGraphQLResponse
            ): TransformedResponse => ({
                repos: response.data.search.edges.map((edge) => ({
                    ...edge.node,
                    // Преобразуем topics в плоский массив строк
                    topics:
                        edge.node.repositoryTopics?.edges.map(
                            (topicEdge) => topicEdge.node.topic.name
                        ) || [],
                })),
                totalCount: response.data.search.repositoryCount,
                pageInfo: response.data.search.pageInfo,
            }),
        }),
    }),
});

// экспорт хуков для использования в компоненте App
export const {
    useSearchReposQuery, // Хук для запроса
    useLazySearchReposQuery, // Ленивый вариант хука
} = githubApi;
