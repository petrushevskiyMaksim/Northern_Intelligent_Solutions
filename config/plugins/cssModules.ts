// Описываем тип плагина вручную
type CSSModulesPlugin = () => {
    name: string;
    enforce?: 'pre' | 'post';
    transform: (code: string, id: string) => string;
};

export const cssModules: CSSModulesPlugin = () => ({
    name: 'vite-plugin-css-modules',
    enforce: 'pre',
    transform(code, id) {
        if (!id.includes('.module.css')) return code;
        // ... (логика плагина, если нужно)
        return code;
    },
});
