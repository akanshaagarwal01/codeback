module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    env: {
        production: {
            plugins: ["transform-remove-console"]
        }
    },
    plugins: [
        "@babel/plugin-proposal-optional-chaining",
        [
            "module-resolver",
            {
                extensions: ["ts", "tsx", "js" ,"jsx"],
                alias: {
                    "design-system": "./src/design-system",
                    "@theme": "./theme",
                    "@framework": "./src/framework",
                    "@modules": "./src/common/modules",
                    "@common": "./src/common",
                    "@cross-platform": "./cross-platform"
                }
            }
        ]
    ]
}