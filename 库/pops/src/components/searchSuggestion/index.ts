import { PopsHandler } from "../../handler/PopsHandler";
import { pops } from "../../Pops";
import { popsDOMUtils } from "../../utils/PopsDOMUtils";
import { popsUtils } from "../../utils/PopsUtils";
import type {
	PopsSearchSuggestionData,
	PopsSearchSuggestionDetails,
} from "./indexType";

export class PopsSearchSuggestion {
	constructor(details: PopsSearchSuggestionDetails) {
		const { $shadowContainer, $shadowRoot } = PopsHandler.handlerShadow();
		PopsHandler.handleInit($shadowRoot, [
			pops.config.cssText.index,
			pops.config.cssText.anim,
			pops.config.cssText.common,
		]);

		let config: Required<PopsSearchSuggestionDetails> = {
			// @ts-ignore
			target: null,
			// @ts-ignore
			inputTarget: null,
			selfDocument: document,
			data: [
				{
					value: "数据1",
					text: "数据1-html",
				},
				{
					value: "数据2",
					text: "数据2-html",
				},
			],
			deleteIcon: {
				enable: true,
				callback(event, liElement, data) {
					console.log("删除当前项", [event, liElement, data]);
					liElement.remove();
				},
			},
			className: "",
			isAbsolute: true,
			isAnimation: true,
			width: "250px",
			maxHeight: "300px",
			followTargetWidth: true,
			topDistance: 0,
			position: "auto",
			positionTopToReverse: true,
			zIndex: 10000,
			searchingTip: "正在搜索中...",
			toSearhNotResultHTML: '<li data-none="true">暂无其它数据</li>',
			toHideWithNotResult: false,
			followPosition: "target",
			getItemHTML(item) {
				return item.text ?? item;
			},
			async getData(value) {
				console.log("当前输入框的值是：", value);
				return [];
			},
			itemClickCallBack(event, liElement, data) {
				console.log("item项的点击回调", [event, liElement, data]);
				this.inputTarget.value = data.value;
			},
			selectCallBack(event, liElement, data) {
				console.log("item项的选中回调", [event, liElement, data]);
			},
			style: "",
		};
		config = popsUtils.assign(config, details);
		if (config.target == null) {
			throw new TypeError("config.target 不能为空");
		}
		/* 做下兼容处理 */
		if (config.inputTarget == null) {
			config.inputTarget = config.target as HTMLInputElement;
		}
		if (details.data) {
			config.data = details.data;
		}
		const guid = popsUtils.getRandomGUID();
		const PopsType = "searchSuggestion";

		if (config.style != null) {
			let cssNode = document.createElement("style");
			cssNode.setAttribute("type", "text/css");
			cssNode.innerHTML = config.style;
			$shadowRoot.appendChild(cssNode);
		}

		const SearchSuggestion = {
			/**
			 * 当前的环境，可以是document，可以是shadowroot，默认是document
			 */
			selfDocument: config.selfDocument,
			/**
			 * 根元素
			 */
			root: null as any as HTMLElement,
			/**
			 * ul元素
			 */
			hintULElement: null as any as HTMLUListElement,
			$data: {
				/** 是否结果为空 */
				isEmpty: true,
			},
			/**
			 * 初始化
			 */
			init(parentElement = document.body || document.documentElement) {
				SearchSuggestion.root = SearchSuggestion.getSearchSelectElement();
				SearchSuggestion.hintULElement =
					SearchSuggestion.root.querySelector<HTMLUListElement>("ul")!;
				SearchSuggestion.update(config.data);
				SearchSuggestion.changeHintULElementWidth();
				SearchSuggestion.changeHintULElementPosition();

				SearchSuggestion.hide();
				if (config.isAnimation) {
					SearchSuggestion.root.classList.add(`pops-${PopsType}-animation`);
				}
				$shadowRoot.appendChild(SearchSuggestion.root);
				parentElement.appendChild($shadowContainer);
			},
			/**
			 * 获取显示出搜索建议框的html
			 */
			getSearchSelectElement() {
				let element = popsDOMUtils.createElement(
					"div",
					{
						className: `pops pops-${PopsType}-search-suggestion`,
						innerHTML: `
						<style>
							.pops-${PopsType}-animation{
								-moz-animation: searchSelectFalIn 0.5s 1 linear;
								-webkit-animation: searchSelectFalIn 0.5s 1 linear;
								-o-animation: searchSelectFalIn 0.5s 1 linear;
								-ms-animation: searchSelectFalIn 0.5s 1 linear;
							}
							.pops-${PopsType}-search-suggestion{
								border: initial;
								overflow: initial;
							}
							ul.pops-${PopsType}-search-suggestion-hint{
								position: ${config.isAbsolute ? "absolute" : "fixed"};
								z-index: ${config.zIndex};
								width: 0;
								left: 0;
								max-height: ${config.maxHeight};
								overflow-x: hidden;
								overflow-y: auto;
								padding: 5px 0;
								background-color: #fff;
								box-sizing: border-box;
								border-radius: 4px;
								box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
							}
							/* 建议框在上面时 */
							ul.pops-${PopsType}-search-suggestion-hint[data-top-reverse]{
								display: flex;
    							flex-direction: column-reverse;
							}
							ul.pops-${PopsType}-search-suggestion-hint[data-top-reverse] li{
								flex-shrink: 0;
							}
							ul.pops-${PopsType}-search-suggestion-hint li{
								padding: 7px;
								margin: 0;
								clear: both;
								color: #515a6e;
								font-size: 14px;
								list-style: none;
								cursor: pointer;
								transition: background .2s ease-in-out;
								overflow: hidden;
								text-overflow: ellipsis;
								width: 100%;
							}
							ul.pops-${PopsType}-search-suggestion-hint li[data-none]{
								text-align: center;
								font-size: 12px;
								color: #8e8e8e;
							}
							ul.pops-${PopsType}-search-suggestion-hint li:hover{
								background-color: rgba(0, 0, 0, .1);
							}            
						</style>
						<ul class="pops-${PopsType}-search-suggestion-hint">
							${config.toSearhNotResultHTML}
						</ul>
         				 `,
					},
					{
						"data-guid": guid,
						"type-value": PopsType,
					}
				);
				if (config.className !== "" && config.className != null) {
					popsDOMUtils.addClassName(element, config.className);
				}
				return element;
			},
			/**
			 * 获取显示出搜索建议框的每一项的html
			 * @param data 当前项的值
			 * @param index 当前项的下标
			 */
			getSearchItemLiElement(data: PopsSearchSuggestionData, index: number) {
				return popsDOMUtils.createElement("li", {
					className: `pops-${PopsType}-search-suggestion-hint-item pops-flex-items-center pops-flex-y-center`,
					"data-index": index,
					"data-value": SearchSuggestion.getItemDataValue(data),
					innerHTML: `
          			${config.getItemHTML(data)}
          			${
									config.deleteIcon.enable
										? SearchSuggestion.getDeleteIconHTML()
										: ""
								}
          			`,
				});
			},
			/**
			 * 获取data-value值
			 * @param data
			 */
			getItemDataValue(data: PopsSearchSuggestionData) {
				return data;
			},
			/**
			 * 设置搜索建议框每一项的点击事件
			 * @param liElement
			 */
			setSearchItemClickEvent(liElement: HTMLLIElement) {
				popsDOMUtils.on(
					liElement,
					"click",
					void 0,
					(event) => {
						popsDOMUtils.preventEvent(event);
						let $click = event.target as HTMLLIElement;
						if ($click.closest(`.pops-${PopsType}-delete-icon`)) {
							/* 点击的是删除按钮 */
							if (typeof config.deleteIcon.callback === "function") {
								config.deleteIcon.callback(
									event,
									liElement,
									(liElement as any)["data-value"]
								);
							}
							if (!this.hintULElement.children.length) {
								/* 全删完了 */
								this.clear();
							}
						} else {
							/* 点击项主体 */
							config.itemClickCallBack(
								event,
								liElement,
								(liElement as any)["data-value"]
							);
						}
					},
					{
						capture: true,
					}
				);
			},
			/**
			 * 设置搜索建议框每一项的选中事件
			 * @param liElement
			 */
			setSearchItemSelectEvent(liElement: HTMLLIElement) {
				// popsDOMUtils.on(
				// 	liElement,
				// 	"keyup",
				// 	void 0,
				// 	(event) => {
				// 		let value = liElement["data-value"];
				// 		config.selectCallBack(event, liElement, value);
				// 	},
				// 	{
				// 		capture: true,
				// 	}
				// );
			},
			/**
			 * 监听输入框内容改变
			 */
			setInputChangeEvent() {
				/* 是input输入框 */
				/* 禁用输入框自动提示 */
				config.inputTarget.setAttribute("autocomplete", "off");
				/* 内容改变事件 */
				popsDOMUtils.on(
					config.inputTarget,
					"input",
					void 0,
					async (event) => {
						let getListResult = await config.getData(
							(event.target as any).value
						);
						SearchSuggestion.update(getListResult);
					},
					{
						capture: true,
					}
				);
			},
			/**
			 * 移除输入框内容改变的监听
			 */
			removeInputChangeEvent() {
				popsDOMUtils.off(config.inputTarget, "input", void 0, void 0, {
					capture: true,
				});
			},
			/**
			 * 显示搜索建议框的事件
			 */
			showEvent() {
				SearchSuggestion.changeHintULElementPosition();
				SearchSuggestion.changeHintULElementWidth();
				if (config.toHideWithNotResult) {
					if (SearchSuggestion.$data.isEmpty) {
						SearchSuggestion.hide();
					} else {
						SearchSuggestion.show();
					}
				} else {
					SearchSuggestion.show();
				}
			},
			/**
			 * 设置显示搜索建议框的事件
			 */
			setShowEvent() {
				/* 焦点|点击事件*/
				if (config.followPosition === "target") {
					popsDOMUtils.on(
						[config.target],
						["focus", "click"],
						void 0,
						SearchSuggestion.showEvent,
						{
							capture: true,
						}
					);
				} else if (config.followPosition === "input") {
					popsDOMUtils.on(
						[config.inputTarget],
						["focus", "click"],
						void 0,
						SearchSuggestion.showEvent,
						{
							capture: true,
						}
					);
				} else if (config.followPosition === "inputCursor") {
					popsDOMUtils.on(
						[config.inputTarget],
						["focus", "click", "input"],
						void 0,
						SearchSuggestion.showEvent,
						{
							capture: true,
						}
					);
				} else {
					throw new TypeError("未知followPosition：" + config.followPosition);
				}
			},
			/**
			 * 移除显示搜索建议框的事件
			 */
			removeShowEvent() {
				/* 焦点|点击事件*/
				popsDOMUtils.off(
					[config.target, config.inputTarget],
					["focus", "click"],
					void 0,
					SearchSuggestion.showEvent,
					{
						capture: true,
					}
				);
				/* 内容改变事件 */
				popsDOMUtils.off(
					[config.inputTarget],
					["input"],
					void 0,
					SearchSuggestion.showEvent,
					{
						capture: true,
					}
				);
			},
			/**
			 * 隐藏搜索建议框的事件
			 * @param event
			 */
			hideEvent(event: PointerEvent | MouseEvent) {
				if (event.target instanceof Node) {
					if ($shadowContainer.contains(event.target)) {
						/* 点击在shadow上的 */
						return;
					}
					if (config.target.contains(event.target)) {
						/* 点击在目标元素内 */
						return;
					}
					if (config.inputTarget.contains(event.target)) {
						/* 点击在目标input内 */
						return;
					}
					SearchSuggestion.hide();
				}
			},
			/**
			 * 设置隐藏搜索建议框的事件
			 */
			setHideEvent() {
				/* 全局点击事件 */
				/* 全局触摸屏点击事件 */
				popsDOMUtils.on(
					SearchSuggestion.selfDocument,
					["click", "touchstart"],
					void 0,
					SearchSuggestion.hideEvent,
					{
						capture: true,
					}
				);
			},
			/**
			 * 移除隐藏搜索建议框的事件
			 */
			removeHideEvent() {
				popsDOMUtils.off(
					SearchSuggestion.selfDocument,
					["click", "touchstart"],
					void 0,
					SearchSuggestion.hideEvent,
					{
						capture: true,
					}
				);
			},
			/**
			 * 设置所有监听
			 */
			setAllEvent() {
				SearchSuggestion.setInputChangeEvent();
				SearchSuggestion.setHideEvent();
				SearchSuggestion.setShowEvent();
			},
			/**
			 * 移除所有监听
			 */
			removeAllEvent() {
				SearchSuggestion.removeInputChangeEvent();
				SearchSuggestion.removeHideEvent();
				SearchSuggestion.removeShowEvent();
			},
			/**
			 * 获取删除按钮的html
			 */
			getDeleteIconHTML(size = 16, fill = "#bababa") {
				return `
				<svg class="pops-${PopsType}-delete-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="${fill}">
					<path d="M512 883.2A371.2 371.2 0 1 0 140.8 512 371.2 371.2 0 0 0 512 883.2z m0 64a435.2 435.2 0 1 1 435.2-435.2 435.2 435.2 0 0 1-435.2 435.2z"></path>
					<path d="M557.056 512l122.368 122.368a31.744 31.744 0 1 1-45.056 45.056L512 557.056l-122.368 122.368a31.744 31.744 0 1 1-45.056-45.056L466.944 512 344.576 389.632a31.744 31.744 0 1 1 45.056-45.056L512 466.944l122.368-122.368a31.744 31.744 0 1 1 45.056 45.056z"></path>
				</svg>
        	`;
			},
			/**
			 * 设置当前正在搜索中的提示
			 */
			setPromptsInSearch() {
				let isSearchingElement = popsDOMUtils.createElement("li", {
					className: `pops-${PopsType}-search-suggestion-hint-searching-item`,
					innerHTML: config.searchingTip,
				});
				SearchSuggestion.hintULElement.appendChild(isSearchingElement);
			},
			/**
			 * 移除正在搜索中的提示
			 */
			removePromptsInSearch() {
				SearchSuggestion.hintULElement
					.querySelector(
						`li.pops-${PopsType}-search-suggestion-hint-searching-item`
					)
					?.remove();
			},
			/**
			 * 清空所有的搜索结果
			 */
			clearAllSearchItemLi() {
				SearchSuggestion.hintULElement.innerHTML = "";
			},
			/**
			 * 修改搜索建议框的位置(top、left)
			 * 因为目标元素可能是动态隐藏的
			 */
			changeHintULElementPosition(
				target = config.target ?? config.inputTarget
			) {
				/** @type {DOMRect|null} */
				let targetRect = null;
				if (config.followPosition === "inputCursor") {
					targetRect = popsDOMUtils.getTextBoundingRect(
						config.inputTarget,
						config.inputTarget.selectionStart || 0,
						config.inputTarget.selectionEnd || 0,
						false
					);
				} else {
					targetRect = config.isAbsolute
						? popsDOMUtils.offset(target)
						: target.getBoundingClientRect();
				}
				if (targetRect == null) {
					return;
				}
				// 文档最大高度
				let documentHeight = document.documentElement.clientHeight;
				if (config.isAbsolute) {
					// 绝对定位
					documentHeight = popsDOMUtils.height(document);
				}
				// 文档最大宽度
				let documentWidth = popsDOMUtils.width(document);
				if (config.position === "top") {
					if (config.positionTopToReverse) {
						SearchSuggestion.hintULElement.setAttribute(
							"data-top-reverse",
							"true"
						);
					}
					// 在上面
					SearchSuggestion.hintULElement.style.top = "";
					SearchSuggestion.hintULElement.style.bottom =
						documentHeight - targetRect.top + config.topDistance + "px";
				} else if (config.position === "bottom") {
					// 在下面
					SearchSuggestion.hintULElement.removeAttribute("data-top-reverse");
					SearchSuggestion.hintULElement.style.bottom = "";
					SearchSuggestion.hintULElement.style.top =
						targetRect.height + targetRect.top + config.topDistance + "px";
				} else if (config.position === "auto") {
					// 自动判断
					if (
						targetRect.bottom +
							popsDOMUtils.height(SearchSuggestion.hintULElement) >
						documentHeight
					) {
						if (config.positionTopToReverse) {
							SearchSuggestion.hintULElement.setAttribute(
								"data-top-reverse",
								"true"
							);
						}
						// 超出浏览器高度了，自动转换为上面去
						SearchSuggestion.hintULElement.style.top = "";
						SearchSuggestion.hintULElement.style.bottom =
							documentHeight - targetRect.top + config.topDistance + "px";
					} else {
						SearchSuggestion.hintULElement.removeAttribute("data-top");
						SearchSuggestion.hintULElement.style.bottom = "";
						SearchSuggestion.hintULElement.style.top =
							targetRect.height + targetRect.top + config.topDistance + "px";
					}
				} else {
					throw new TypeError("未知设置的位置" + config.position);
				}
				let hintUIWidth = popsDOMUtils.width(SearchSuggestion.hintULElement);
				SearchSuggestion.hintULElement.style.left =
					(targetRect.left + hintUIWidth > documentWidth
						? documentWidth - hintUIWidth
						: targetRect.left) + "px";
			},
			/**
			 * 修改搜索建议框的width
			 * 因为目标元素可能是动态隐藏的
			 */
			changeHintULElementWidth(target = config.target ?? config.inputTarget) {
				let targetRect = target.getBoundingClientRect();
				if (config.followTargetWidth) {
					SearchSuggestion.hintULElement.style.width = targetRect.width + "px";
				} else {
					SearchSuggestion.hintULElement.style.width = config.width;
				}
			},
			/**
			 * 更新页面显示的搜索结果
			 * @param data
			 */
			update(data: PopsSearchSuggestionData[] = []) {
				if (!Array.isArray(data)) {
					throw new TypeError("传入的数据不是数组");
				}
				config.data = data;
				/* 清空已有的搜索结果 */
				if (config.data.length) {
					SearchSuggestion.$data.isEmpty = false;

					if (config.toHideWithNotResult) {
						SearchSuggestion.show();
					}
					SearchSuggestion.clearAllSearchItemLi();
					/* 添加进ul中 */
					config.data.forEach((item, index) => {
						let itemElement = SearchSuggestion.getSearchItemLiElement(
							item,
							index
						);
						SearchSuggestion.setSearchItemClickEvent(itemElement);
						SearchSuggestion.setSearchItemSelectEvent(itemElement);
						SearchSuggestion.hintULElement.appendChild(itemElement);
					});
				} else {
					/* 清空 */
					SearchSuggestion.clear();
				}
			},
			/**
			 * 清空当前的搜索结果并显示无结果
			 */
			clear() {
				this.$data.isEmpty = true;
				this.clearAllSearchItemLi();
				this.hintULElement.appendChild(
					popsUtils.parseTextToDOM(config.toSearhNotResultHTML)
				);
				if (config.toHideWithNotResult) {
					this.hide();
				}
			},
			/**
			 * 隐藏搜索建议框
			 */
			hide() {
				this.root.style.display = "none";
			},
			/**
			 * 显示搜索建议框
			 */
			show() {
				this.root.style.display = "";
			},
		};
		return SearchSuggestion;
	}
}
