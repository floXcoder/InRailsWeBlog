'use strict';

import {
    pushError
} from '../actions';

function convertRelationships(object, relationships, included) {
    if (relationships && included) {
        Object.entries(relationships).forEach(([relationName, relationData]) => {
            if (!relationData.data) {
                return;
            }

            if (Array.isArray(relationData.data)) {
                object[relationName] = relationData.data.map((datum) => {
                    const relation = included.find((include) => include.id === datum.id && include.type === datum.type);

                    if (relation) {
                        return relation.attributes;
                    } else {
                        pushError({
                            statusText: `${relationName} relation not found in ${included.map((include) => include.type).join(', ')}`
                        });

                        return undefined;
                    }
                });
            } else {
                const relation = included.find((include) => include.id === relationData.data.id && include.type === relationData.data.type);
                if (relation) {
                    object[relationName] = relation.attributes;
                } else {
                    pushError({
                        statusText: `${relationName} relation not found in ${included.map((include) => include.type).join(', ')}`
                    });
                }
            }
        });
    }

    return object;
}

export function convertJsonApi(response) {
    let formattedResponse = {};

    if (response?.data?.type) {
        const rootKey = (response.meta && response.meta.root) || response.data.type;

        formattedResponse[rootKey] = {
            ...response.data.attributes
        };

        convertRelationships(formattedResponse[rootKey], response.data.relationships, response.included);
    } else if (response?.data && Array.isArray(response.data)) {
        if (response.meta?.root) {
            formattedResponse[response.meta.root] = response.data.map((datum) => convertRelationships({...datum.attributes}, datum.relationships, response.included));
        } else {
            formattedResponse = response.data.map((datum) => convertRelationships({...datum.attributes}, datum.relationships, response.included));
        }
    } else {
        formattedResponse = response;
    }

    if (response?.meta) {
        const {root, ...meta} = response.meta;
        formattedResponse.meta = meta;
    }

    return formattedResponse;
}

export const extractDataFromElement = (elementId, extractAndRemove = true) => {
    const componentElement = document.getElementById(elementId);
    const componentData = {};

    if (!componentElement || !componentElement.attributes) {
        return componentData;
    }

    [].forEach.call(componentElement.attributes, function (componentAttribute) {
        if (/^data-/.test(componentAttribute.name)) {
            const dataName = componentAttribute.name.substr(5)
                .replace(/-(.)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            componentData[dataName] = componentAttribute.value.startsWith('{') || componentAttribute.value.startsWith('[') ? JSON.parse(componentAttribute.value) : componentAttribute.value;
            if (Array.isArray(componentData[dataName]) || typeof componentData[dataName] === 'object') {
                componentData[dataName] = convertJsonApi(componentData[dataName]);
            }
        }
    });

    if (extractAndRemove) {
        Object.keys(componentData)
            .forEach((componentKey) => delete componentElement.dataset[componentKey]);
    }

    return componentData;
};
