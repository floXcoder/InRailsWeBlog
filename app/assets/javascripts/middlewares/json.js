'use strict';

function convertRelationships(object, relationships, included) {
    if(relationships && included) {
        Object.entries(relationships).forEach(([relationName, relationData]) => {
            if (Array.isArray(relationData.data)) {
                object[relationName] = relationData.data.map((datum) => included.find((include) => include.id === datum.id && include.type === datum.type).attributes)
            } else {
                object[relationName] = included.find((include) => include.id === relationData.data.id && include.type === relationData.data.type).attributes;
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
            formattedResponse[response.meta.root] = response.data.map((datum) => convertRelationships(datum.attributes, datum.relationships, response.included));
        } else {
            formattedResponse = response.data.map((datum) => convertRelationships(datum.attributes, datum.relationships, response.included));
        }
    } else {
        formattedResponse = response;
    }

    if(response.meta) {
        const {root, ...meta} = response.meta;
        formattedResponse.meta = meta;
    }

    return formattedResponse;
}
