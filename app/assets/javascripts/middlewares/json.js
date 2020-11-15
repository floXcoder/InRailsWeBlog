'use strict';

import {
    pushError
} from '../actions';

function convertRelationships(object, relationships, included) {
    if (relationships && included) {
        Object.entries(relationships).forEach(([relationName, relationData]) => {
            if(!relationData.data) {
                return;
            }

            if (Array.isArray(relationData.data)) {
                object[relationName] = relationData.data.map((datum) => {
                    const relation = included.find((include) => include.id === datum.id && include.type === datum.type);

                    if (relation) {
                        return relation.attributes
                    } else {
                        pushError({
                            statusText: `${relationName} relation not found in ${included.map((include) => include.type).join(', ')}`
                        });

                        return undefined;
                    }
                })
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

export function extractDataFromElement(elementId) {
    const element = document.getElementById(elementId);
    let data = {};

    if (!element || !element.attributes) {
        return data;
    }

    [].forEach.call(element.attributes, function (attr) {
        if (/^data-/.test(attr.name)) {
            const camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
            data[camelCaseName] = attr.value.startsWith('{') || attr.value.startsWith('[') ? JSON.parse(attr.value) : attr.value;
            if (Array.isArray(data[camelCaseName]) || typeof data[camelCaseName] === 'object') {
                data[camelCaseName] = convertJsonApi(data[camelCaseName]);
            }
        }
    });

    return data;
}
