export default {
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'color-named': 'always-where-possible',
    'max-nesting-depth': 99,
    'scss/selector-no-redundant-nesting-selector': null,
    'selector-max-compound-selectors': 9,
    'selector-max-id': 1,
    'selector-no-qualifying-type': [null, { ignore: ['attribute', 'class'] }],
  },
}
