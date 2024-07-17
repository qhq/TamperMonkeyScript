import i18next from "i18next";
import { UISelect } from "../common-components/ui-select";
import { UISwitch } from "../common-components/ui-switch";
import { PopsPanelContentConfig } from "@whitesev/pops/dist/types/src/components/panel/indexType";
import { DOMUtils, utils } from "@/env";
import { PopsPanel } from "../setting";
import { GreasyforkScriptsFilter } from "@/main/navigator/scripts/GreasyforkScriptsFilter";

export const SettingUIScripts: PopsPanelContentConfig = {
	id: "greasy-fork-panel-config-scripts",
	title: i18next.t("脚本"),
	forms: [
		{
			text: "",
			type: "forms",
			forms: [
				{
					text: i18next.t("代码"),
					type: "deepMenu",
					forms: [
						{
							text: "",
							type: "forms",
							forms: [
								UISwitch(
									i18next.t("添加复制代码按钮"),
									"addCopyCodeButton",
									true,
									void 0,
									i18next.t("更优雅的复制")
								),
								UISwitch(
									i18next.t("快捷键"),
									"fullScreenOptimization",
									true,
									void 0,
									i18next.t("【F】键全屏、【Alt+Shift+F】键宽屏")
								),
								UISwitch(
									i18next.t("修复代码行号显示"),
									"code-repairCodeLineNumber",
									true,
									void 0,
									i18next.t("修复代码行数超过1k行号显示不全问题")
								),
							],
						},
					],
				},
				{
					text: i18next.t("历史版本"),
					type: "deepMenu",
					forms: [
						{
							text: i18next.t("功能"),
							type: "forms",
							forms: [
								UISwitch(
									i18next.t("添加额外的标签按钮"),
									"scripts-versions-addExtraTagButton",
									true,
									void 0,
									i18next.t("在版本下面添加【安装】、【查看代码】按钮")
								),
							],
						},
						{
							text: i18next.t("美化"),
							type: "forms",
							forms: [
								UISwitch(
									i18next.t("美化历史版本页面"),
									"beautifyHistoryVersionPage",
									true,
									void 0,
									i18next.t("更直观的查看版本迭代")
								),
							],
						},
					],
				},
			],
		},
		{
			text: "",
			type: "forms",
			forms: [
				{
					text: i18next.t("功能"),
					type: "deepMenu",
					forms: [
						{
							text: "",
							type: "forms",
							forms: [
								UISwitch(
									i18next.t("添加【寻找引用】按钮"),
									"addFindReferenceButton",
									true,
									void 0,
									i18next.t("在脚本栏添加按钮，一般用于搜索引用该库的相关脚本")
								),
								UISwitch(
									i18next.t("添加【收藏】按钮"),
									"addCollectionButton",
									true,
									void 0,
									i18next.t("在脚本栏添加按钮，一般用于快捷收藏该脚本/库")
								),
								UISwitch(
									i18next.t("添加【今日检查】信息块"),
									"scriptHomepageAddedTodaySUpdate",
									true,
									void 0,
									i18next.t("在脚本信息栏添加【今日检查】信息块")
								),
							],
						},
					],
				},
				{
					text: i18next.t("美化"),
					type: "deepMenu",
					forms: [
						{
							text: "",
							type: "forms",
							forms: [
								UISwitch(
									i18next.t("美化脚本列表"),
									"beautifyCenterContent",
									true,
									void 0,
									i18next.t("双列显示且添加脚本卡片操作项（安装、收藏）")
								),
							],
						},
					],
				},
				{
					text: i18next.t("过滤"),
					type: "deepMenu",
					forms: [
						{
							text: `<a target="_blank" href="https://greasyfork.org/zh-CN/scripts/475722-greasyfork%E4%BC%98%E5%8C%96#:~:text=%E5%B1%8F%E8%94%BD%E8%A7%84%E5%88%99">${i18next.t(
								"帮助文档"
							)}</a>`,
							type: "forms",
							forms: [
								UISwitch(
									i18next.t("启用"),
									"gf-scripts-filter-enable",
									true,
									void 0,
									i18next.t("作用域：脚本、脚本搜索、用户主页")
								),
								{
									type: "own",
									getLiElementCallBack(liElement) {
										let textareaDiv = DOMUtils.createElement(
											"div",
											{
												className: "pops-panel-textarea",
												innerHTML: `
												<textarea placeholder="${i18next.t(
													"请输入规则，每行一个"
												)}" style="height:150px;"></textarea>`,
											},
											{
												style: "width: 100%;",
											}
										);
										let textarea = textareaDiv.querySelector(
											"textarea"
										) as HTMLTextAreaElement;
										textarea.value = PopsPanel.getValue(
											GreasyforkScriptsFilter.key,
											""
										);
										DOMUtils.on(
											textarea,
											["input", "propertychange"],
											void 0,
											utils.debounce(function (event) {
												PopsPanel.setValue(
													GreasyforkScriptsFilter.key,
													textarea.value
												);
											}, 200)
										);
										liElement.appendChild(textareaDiv);
										return liElement;
									},
								},
							],
						},
					],
				},
			],
		},
	],
};
