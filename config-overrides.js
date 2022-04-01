const StylelintPlugin = require('stylelint-webpack-plugin')
const { override, addWebpackPlugin } = require("customize-cra")
const webpack = require("webpack")
const packageJson = require("./package.json")

module.exports = override(
    (
        () => {
            if (process.env.NODE_ENV === "development") {
                // check style files on development only
                return addWebpackPlugin(
                    new StylelintPlugin({
                        context: "src/style",
                    })
                )
            }
        }
    )(),

    addWebpackPlugin(
        // define extra environment variables
        new webpack.DefinePlugin({
            "process.env.DAKARA_VERSION": JSON.stringify(packageJson.version),
            "process.env.DAKARA_BUGTRACKER": JSON.stringify(packageJson.bugs.url),
            "process.env.DAKARA_PROJECT_HOMEPAGE": JSON.stringify(
                packageJson.projectHomepage
            ),
        })
    ),
)
