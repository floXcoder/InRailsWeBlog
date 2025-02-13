import {useState} from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import Button from '@mui/material/Button';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

import I18n from '@js/modules/translations';

import {
    userHomePath
} from '@js/constants/routesHelper';

import ArticleCardSort from '@js/components/articles/sort/card';


function SortableItem({
                          article
                      }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: article.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div ref={setNodeRef}
             style={style}
             {...attributes}
             {...listeners}>
            <ArticleCardSort article={article}/>
        </div>
    );
}

export default function ArticleSorterDisplay({
                                                 currentUserSlug,
                                                 isProcessing,
                                                 articles: initialArticles,
                                                 updateArticlePriority
                                             }) {
    const [articles, setArticles] = useState(initialArticles);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const _handleDragEnd = (event) => {
        const {
            active,
            over
        } = event;

        if (active.id !== over.id) {
            setArticles((sortedArticles) => {
                const oldIndex = sortedArticles.findIndex((article) => article.id === active.id);
                const newIndex = sortedArticles.findIndex((article) => article.id === over.id);

                return arrayMove(sortedArticles, oldIndex, newIndex);
            });
        }
    };

    const _handleSavePriority = (event) => {
        event.preventDefault();

        updateArticlePriority(articles.map((article) => article.id));
    };

    return (
        <div className="article-sort-sorting">
            <div className="row">
                <div className="col s12 m6 center-align">
                    <Button variant="outlined"
                            size="small"
                            component={Link}
                            to={userHomePath(currentUserSlug)}>
                        {I18n.t('js.helpers.buttons.cancel')}
                    </Button>
                </div>

                <div className="col s12 m6 center-align">
                    <Button color="primary"
                            variant="outlined"
                            disabled={isProcessing}
                            onClick={_handleSavePriority}>
                        {I18n.t('js.helpers.buttons.apply')}
                    </Button>
                </div>
            </div>

            <DndContext sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={_handleDragEnd}>
                <SortableContext items={articles.map((article) => article.id)}
                                 strategy={verticalListSortingStrategy}>
                    {
                        articles.map((article) => (
                            <SortableItem key={article.id}
                                          article={article}/>
                        ))
                    }
                </SortableContext>
            </DndContext>
        </div>
    );
}

ArticleSorterDisplay.propTypes = {
    currentUserSlug: PropTypes.string.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    // Articles must already be sorted by priority
    articles: PropTypes.array.isRequired,
    updateArticlePriority: PropTypes.func.isRequired
};