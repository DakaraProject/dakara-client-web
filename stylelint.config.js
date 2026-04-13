export default {
  extends: [
    'stylelint-config-sass-guidelines',
    'stylelint-prettier/recommended',
  ],
  plugins: ['stylelint-order'],
  rules: {
    '@stylistic/function-parentheses-space-inside': 'never-single-line',
    'color-named': 'always-where-possible',
    'max-nesting-depth': 99,
    'order/properties-alphabetical-order': true,
    'scss/selector-no-redundant-nesting-selector': null,
    'selector-max-compound-selectors': 9,
    'selector-max-id': 1,
    'selector-no-qualifying-type': [null, { ignore: ['attribute', 'class'] }],
    'selector-pseudo-element-no-unknown': [
      true,
      { ignorePseudoElements: ['/^range-/'] },
    ],
    'selector-class-pattern': null,
  },
}
