// Factories
const Factories = {
    articles: require('./factories/articles'),
    comments: require('./factories/comments'),
    history: require('./factories/history'),
    pictures: require('./factories/pictures'),
    settings: require('./factories/settings'),
    tags: require('./factories/tags'),
    topics: require('./factories/topics'),
    users: require('./factories/users'),
};

const FactoryGenerator = {
    toJson: (factory, props = {}) => {
        if (typeof Factories[factory] !== 'function') {
            throw Error('Factory does not exist');
        }

        if (!props.id) {
            props.id = 1;
        }
        const generator = Factories[factory](props);
        const keys = Object.keys(generator);
        let attributes = {};

        if (props.refName && props.refId) {
            attributes[`${props.refName}Id`] = props.refId;
        }
        for (let i = keys.length - 1, property, key; i >= 0; i--) {
            key = keys[i];
            property = generator[key];
            if (property instanceof Object) {
                if (property['belongsTo']) {
                    let belongsToId = props.initialId || props.id;
                    attributes[key] = FactoryGenerator.toJson(property['belongsTo'], {...props, id: belongsToId});
                    attributes[`${key}Id`] = belongsToId;
                } else if (property['hasOne']) {
                    let hasOneId = props.id;
                    attributes[key] = FactoryGenerator.toJson(property['hasOne'], {...props, id: hasOneId, refName: factory, refId: hasOneId});
                } else if (property['hasMany']) {
                    let hasManyAssociations = [];
                    for (let i = 0; i < property['number']; i++) {
                        hasManyAssociations.push(FactoryGenerator.toJson(property['hasMany'], {...props, id: i + 1}));
                    }
                    attributes[key] = hasManyAssociations
                } else {
                    attributes[key] = property;
                }
            } else {
                attributes[key] = property;
            }
        }

        const {defined, initialId, ...newProps}= props;
        const propsKeys = Object.keys(newProps);
        for (let i = propsKeys.length - 1, key; i >= 0; i--) {
            key = propsKeys[i];
            attributes[key] = newProps[key];
        }

        return attributes;
    },

    // Props:
    // number: number of elements
    // defined: create static data (by default random data)
    // initialId: id value for belongs to association
    create: (factory, props) => {
        if (props && props.number) {
            let generators = [];
            for (let i = 0; i < props.number; i++) {
                const {number, ...newProps} = props;
                generators.push(FactoryGenerator.toJson(factory, {...newProps, id: i + 1, initialId: props.initialId || 1}));
            }
            return generators;
        } else {
            return FactoryGenerator.toJson(factory, props);
        }
    }
};

export default FactoryGenerator;
