const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        autoprefixer({
            remove: false, // do not seek outdated prefixes
        }),
    ]
}
