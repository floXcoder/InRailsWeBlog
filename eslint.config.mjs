import globals from 'globals';
import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';

export default [
    js.configs.all, // Recommended config applied to all files
    {
        ignores: [
            '**/urlParser.js',
            'app/assets/stylesheets/**/*',
            'app/javascript/stylesheets/**/*',
            'node_modules/*'
        ]
    },
    {
        name: 'project-common',
        languageOptions: {
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
                require: true,
                GlobalEnvironment: true,
                Promise: true,
                jQuery: true,
                React: true,
                ReactCreateRoot: true,
                connect: true,
                PropTypes: true,
                I18n: true,
                Utils: true,
                classNames: true,
                log: true
            }
        },
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            'accessor-pairs': 0,
            'arrow-body-style': 0,
            'block-scoped-var': 0,
            'class-methods-use-this': 0,
            'camelcase': 1,
            'capitalized-comments': 0,
            'comma-dangle': 0,
            'complexity': [
                0,
                11
            ],
            'consistent-return': 0,
            'curly': [
                0,
                'all'
            ],
            'default-case': 0,
            'dot-notation': [
                0,
                {
                    'allowKeywords': true
                }
            ],
            'dot-location': 0,
            'func-names': 0,
            'func-style': 0,
            'global-require': 0,
            'guard-for-in': 0,
            'id-length': 0,
            'indent': 0,
            'init-declarations': 0,
            'max-depth': 0,
            'max-len': 0,
            'max-lines': 0,
            'max-lines-per-function': 0,
            'max-params': 0,
            'max-statements': 0,
            'new-cap': 0,
            'no-alert': 0,
            'no-bitwise': 0,
            'no-caller': 0,
            'no-console': 0,
            'no-continue': 0,
            'no-div-regex': 0,
            'no-else-return': 0,
            'no-empty-label': 0,
            'no-eq-null': 0,
            'no-eval': 0,
            'no-extend-native': 0,
            'no-extra-bind': 0,
            'no-extra-boolean-cast': 0,
            'no-fallthrough': 2,
            'no-floating-decimal': 0,
            'no-implicit-coercion': 0,
            'no-implied-eval': 0,
            'no-inline-comments': 0,
            'no-invalid-this': 0,
            'no-iterator': 0,
            'no-labels': 0,
            'no-lone-blocks': 0,
            'no-loop-func': 0,
            'no-magic-numbers': 0,
            'no-multi-spaces': 0,
            'no-multi-str': 0,
            'no-multiple-empty-lines': 0,
            'no-native-reassign': 0,
            'no-negated-condition': 0,
            'no-nested-ternary': 0,
            'no-new': 0,
            'no-new-func': 0,
            'no-new-wrappers': 0,
            'no-octal': 2,
            'no-octal-escape': 0,
            'no-param-reassign': 0,
            'no-plusplus': 0,
            'no-process-env': 0,
            'no-proto': 0,
            'no-prototype-builtins': 0,
            'no-redeclare': 2,
            'no-return-assign': 0,
            'no-script-url': 0,
            'no-self-compare': 0,
            'no-sequences': 0,
            'no-ternary': 0,
            'no-throw-literal': 0,
            'no-trailing-spaces': 0,
            'no-undefined': 0,
            'no-underscore-dangle': 0,
            'no-unused-expressions': 0,
            'no-useless-call': 0,
            'no-useless-constructor': 0,
            'no-var': 0,
            'no-void': 0,
            'no-warning-comments': [
                0,
                {
                    'terms': [
                        'todo',
                        'fixme',
                        'xxx'
                    ],
                    'location': 'start'
                }
            ],
            'no-with': 0,
            'object-curly-spacing': 0,
            'object-curly-newline': 0,
            'object-shorthand': 0,
            'one-var': 0,
            'operator-linebreak': 0,
            'prefer-arrow-callback': 0,
            'prefer-destructuring': 0,
            'prefer-template': 0,
            'radix': 0,
            'require-unicode-regexp': 0,
            'semi': 1,
            'sort-keys': 0,
            'sort-imports': 0,
            'spaced-comment': 0,
            'strict': 0,
            'vars-on-top': 0,
            'wrap-iife': 0
        }
    },
    {
        name: 'project-react',
        files: ['**/*.{js,mjs,cjs,jsx}'],
        ...reactRecommended,
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        // settings: {
        //     react: {
        //         version: 'detect'
        //     }
        // },
        rules: {
            'react/boolean-prop-naming': 0,
            'react/default-props-match-prop-types': 1,
            'react/destructuring-assignment': 0,
            'react/display-name': 0,
            'react/forbid-prop-types': 0,
            'react/jsx-boolean-value': 0,
            'react/jsx-closing-bracket-location': 0,
            'react/jsx-closing-tag-location': 1,
            'react/jsx-curly-spacing': 1,
            'react/jsx-first-prop-new-line': 0,
            'react/jsx-fragments': 0,
            'react/jsx-indent': 0,
            'react/jsx-indent-props': 0,
            'react/jsx-key': 1,
            'react/jsx-max-props-per-line': 1,
            'react/jsx-no-bind': 0,
            'react/jsx-no-duplicate-props': 1,
            'react/jsx-no-leaked-render': 1,
            'react/jsx-no-literals': 0,
            'react/jsx-no-target-blank': 0,
            'react/jsx-no-undef': 0,
            'react/jsx-one-expression-per-line': 0,
            'react/jsx-props-no-spreading': 0,
            'react/jsx-pascal-case': 1,
            'react/jsx-sort-prop-types': 0,
            'react/jsx-sort-props': 0,
            'react/jsx-tag-spacing': 0,
            'react/jsx-uses-vars': 1,
            'react/jsx-wrap-multilines': 0,
            'react/no-access-state-in-setstate': 0,
            'react/no-array-index-key': 0,
            'react/no-danger': 0,
            'react/no-did-mount-set-state': 1,
            'react/no-did-update-set-state': 1,
            'react/no-direct-mutation-state': 1,
            'react/no-multi-comp': 0,
            'react/no-set-state': 0,
            'react/no-unknown-property': 1,
            'react/no-unused-prop-types': 1,
            'react/no-unused-state': 1,
            'react/prefer-es6-class': 0,
            'react/prop-types': 1,
            'react/react-in-jsx-scope': 0,
            'react/require-default-props': 0,
            'react/require-extension': 'off',
            'react/require-render-return': 1,
            'react/self-closing-comp': 1,
            'react/sort-comp': 1,
            'react/state-in-constructor': 0,
            'react/static-property-placement': 0
        }
    }
];
