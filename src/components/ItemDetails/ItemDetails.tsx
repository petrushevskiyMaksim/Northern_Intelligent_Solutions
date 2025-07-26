import type { Repository } from '../../features/model/types/types';
import cls from './ItemDetails.module.scss';
import { Typography } from '@mui/material';
import Star from '../../assets/star.svg';

/**
 * Пропсы для компонента деталей репозитория
 */
interface ItemDetailsProps {
    item: Repository | null; // Данные репозитория или null
}

/**
 * Компонент для отображения детальной информации о репозитории
 */
const ItemDetails = (props: ItemDetailsProps) => {
    const { item } = props;

    return (
        <aside className={cls.item_details}>
            {item ? (
                <div className={cls.item_details_body}>
                    <Typography variant='h4' gutterBottom>
                        {item.name ? item.name : 'Имя репозитория не указано'}
                    </Typography>

                    <div className={cls.landStarWrap}>
                        <span className={cls.language}>
                            {item.primaryLanguage?.name
                                ? item.primaryLanguage?.name
                                : 'Язык не указан'}
                        </span>
                        <span className={cls.stars}>
                            <Star />
                            <span className={cls.totalStars}>
                                {item.stargazers.totalCount}
                            </span>
                        </span>
                    </div>

                    <p className={cls.description}>
                        {item.description
                            ? item.description
                            : 'Описание не добавлено'}
                    </p>

                    {item.topics.length > 0 && (
                        <ul className={cls.topicList}>
                            {item.topics.map((topic, i) => {
                                return (
                                    <li key={i} className={cls.topic}>
                                        {topic ? topic : ''}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <small>
                        {item.licenseInfo?.name
                            ? item.licenseInfo?.name
                            : 'Лицензия не указана'}
                    </small>
                </div>
            ) : (
                <p className={cls.not_item_details}>Выберите репозиторий</p>
            )}
        </aside>
    );
};

export default ItemDetails;
