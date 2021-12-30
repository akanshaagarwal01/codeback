const path = require("path");
const fs = require("fs");
const Resolver = require("metro-resolver");
const Resolve = require("enhanced-resolve");

const commonCodePath = "src/common";
const toBeReplacedText = "common";

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false
            }
        }),
        babelTransformerPath: require.resolve("react-native-typescript-transformer")
    },
    server: {
        port: 8082
    },
    resolver: {
        resolveRequest: (context, moduleName, platform, realModuleName) => {
            const clearContext = { ...context, resolveRequest: undefined};
            const originPath = context.originModulePath.replace(`/${path.basename(context.originModulePath)}`, '');
            const absoluteModule = path.resolve(originPath, moduleName);
            if (absoluteModule.startsWith(`${path.resolve(__dirname)}/${commonCodePath}`)) {
                const clearContext = { ...context, resolveRequest: undefined};
                const ppath = absoluteModule.replace(toBeReplacedText, `apps/${process.env.CURRENT_APP}`);
                let filePresent = false;
                if (fs.existsSync(ppath)) {
                    context.sourceExts.forEach((extn) => {
                        if (fs.existsSync(`${ppath}/index.${extn}`)) {
                            filePresent = true;
                        }
                    })
                } else {
                    context.sourceExts.forEach((extn) => {
                        if (fs.existsSync(`${ppath}.${extn}`)) {
                            filePresent = true;
                        }
                    })
                }
                if (filePresent) {
                    return Resolver.resolve(clearContext, ppath, platform);
                }
           }
           return Resolver.resolve(clearContext, moduleName, platform, realModuleName);
        }
    }
}