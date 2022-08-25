module.exports = {
    name: 'probody',
    apps: [
        {
            name: "core",
            script: "node server.js",
            watch: false
        },
        {
            name: "admin",
            script: "yarn --cwd admin-front start",
            watch: false
        }
    ]
}
