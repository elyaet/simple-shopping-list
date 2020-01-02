module.exports = {
    publicPath: "/courses/",
    devServer: {
        proxy: 'https://simple-shopping-list-server/courses',
    }
}
