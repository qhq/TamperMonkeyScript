import type { PopsSupportAnim, PopsSupportBottomBtn, PopsSupportContent, PopsSupportHeaderTitle, PopsTypeSupportAnim, PopsTypeSupportBottomBtn, PopsTypeSupportContent, PopsTypeSupportHeaderTitle } from "../types/main";
export declare const PopsElementHandler: {
    /**
     * 获取遮罩层HTML
     * @param guid
     * @param zIndex z-index
     * @param style
     */
    getMaskHTML(guid: string, zIndex?: number, style?: string): string;
    /**
     * 获取动画层HTML
     * @param guid
     * @param type
     * @param config
     * @param html
     * @param bottomBtnHTML
     */
    getAnimHTML(guid: string, type: PopsTypeSupportAnim, config: PopsSupportAnim[keyof PopsSupportAnim], html?: string, bottomBtnHTML?: string): string;
    /**
     * 获取顶部按钮层HTML
     * @param type
     * @param config
     */
    getHeaderBtnHTML(type: PopsTypeSupportHeaderTitle, config: PopsSupportHeaderTitle[keyof PopsSupportHeaderTitle]): string;
    /**
     * 获取底部按钮层HTML
     * @param type
     * @param config
     */
    getBottomBtnHTML(type: PopsTypeSupportBottomBtn, config: PopsSupportBottomBtn[keyof PopsSupportBottomBtn]): string;
    /**
     * 获取标题style
     * @param type
     * @param config
     */
    getHeaderStyle(type: PopsTypeSupportHeaderTitle, config: PopsSupportHeaderTitle[keyof PopsSupportHeaderTitle]): {
        headerStyle: string;
        headerPStyle: string;
    };
    /**
     * 获取内容style
     * @param type
     * @param config
     */
    getContentStyle(type: PopsTypeSupportContent, config: PopsSupportContent[keyof PopsSupportContent]): {
        contentStyle: string;
        contentPStyle: string;
    };
    /**
     * 将html转换成元素
     * @param html
     */
    parseElement<T extends HTMLElement>(html: string): T;
};
