import { addStyle, log } from "@/env";
import { PopsPanel } from "@/setting/setting";
import WenKuShieldCSS from "./shield.css?raw";
import { CommonUtils } from "@/utils/CommonUtils";

const BaiduWenKu = {
	init() {
		addStyle(WenKuShieldCSS);
		log.info("插入CSS规则");
		addStyle(/*css*/ `
        /* 上面的工具栏会挡住标题栏 */
        #app-pre .top-card.top-card-top{
            margin-top: 56px !important;
        }
        `);
		PopsPanel.execMenuOnce("baidu_wenku_block_member_picks", () => {
			return this.shieldVipPicks();
		});
		PopsPanel.execMenuOnce("baidu_wenku_blocking_app_featured", () => {
			return this.shieldAppPicks();
		});
		PopsPanel.execMenuOnce("baidu_wenku_blocking_related_documents", () => {
			return this.shieldRelatedDocuments();
		});
		PopsPanel.execMenuOnce("baidu_wenku_blocking_bottom_toolbar", () => {
			return this.shieldBottomToolBar();
		});
		PopsPanel.execMenuOnce("baidu_wenku_shield_next_btn", () => {
			return this.shieldNextArticleButton();
		});
		PopsPanel.execMenuOnce("baidu_wenku_blockDocumentAssistant", () => {
			return this.blockDocumentAssistant();
		});
	},
	/** 屏蔽会员精选 */
	shieldVipPicks() {
		log.info("屏蔽会员精选");
		return CommonUtils.addBlockCSS(
			'div[class*="vip-choice_"][data-ait-action="vipChoiceShow"]'
		);
	},
	/** 屏蔽APP精选 */
	shieldAppPicks() {
		log.info("屏蔽APP精选");
		return CommonUtils.addBlockCSS(
			'div[class*="app-choice_"][data-ait-action="appChoiceNewShow"]',
			"div.folder-wrap.invite-clipboard[data-clipboard-text]"
		);
	},
	/** 屏蔽相关文档 */
	shieldRelatedDocuments() {
		log.info("屏蔽相关文档");
		return CommonUtils.addBlockCSS(
			"div.fold-page-conversion",
			"div.newrecom-list.invite-clipboard[data-clipboard-text]"
		);
	},
	/** 屏蔽底部工具栏 */
	shieldBottomToolBar() {
		log.info("屏蔽底部工具栏");
		return CommonUtils.addBlockCSS("div.barbottom");
	},
	/** 屏蔽下一篇按钮 */
	shieldNextArticleButton() {
		log.info("屏蔽下一篇按钮");
		return CommonUtils.addBlockCSS("div.next-page-container");
	},
	/** 【屏蔽】文档助手 */
	blockDocumentAssistant() {
		log.info("【屏蔽】文档助手");
		return CommonUtils.addBlockCSS(".ai-chat-wrap");
	},
};

export { BaiduWenKu };
