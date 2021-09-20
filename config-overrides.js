const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {
    webpack: function (config, env) {
        if (env === 'development') {
            config.plugins.push(
                new StylelintPlugin({
                    context: "src/style",
                })
            )
        }

        return config
    }
}
