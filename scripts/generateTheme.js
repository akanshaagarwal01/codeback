const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const generateTheme = (app) => {
    import('theme path for app')
        .then((obj) => {
            const template = (theme, groceryTheme) =>
            `
            import BaseTheme, {getLocalisedTheme} from '@design-system/tokens/BaseTheme';
            import Languages from '@design-system/tokens/BaseLang';
            export const LocaleTheme: BaseTheme = ${theme}
            export const GroceryTheme: BaseTheme = ${groceryTheme};
            let theme = getLocalisedTheme(Languages.en, LocaleTheme);
            export const setTheme = (newTheme = LocaleTheme, locale = Languages.en) => {
                const themeObj = getLocalisedTheme(locale, newTheme);
                theme = Object.assign(theme, themeObj);
            };
            export default theme;
            `;
            fs.writeFileSync(`./theme.ts`, template(JSON.stringify(obj.default), JSON.stringify(obj.GroceryTheme)), 'utf-8');
            execSync(`${path.resolve(__dirname, 'path to prettier')} --write 'theme file path'`);
        })
}

module.exports = {
    generateTheme
};
