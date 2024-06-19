import { log, utils } from "@/env";
import { PopsPanel } from "@/setting/setting";
import type { HttpxDetails } from "@whitesev/utils/dist/src/Httpx";

export const HttpxCookieManager = {
	$data: {
		cookieList: [
			{
				key: "httpx-cookie-tieba.baidu.com",
				hostname:
					/(tieba.baidu|www.tieba|ala.baidu|static.tieba.baidu|nba.baidu).com/g,
			},
		],
	},
	/**
	 * 补充cookie末尾分号
	 */
	fixCookieSplit(str: string) {
		if (utils.isNotNull(str) && !str.trim().endsWith(";")) {
			// 补充;
			str += ";";
		}
		return str;
	},
	/**
	 * 合并两个cookie
	 */
	concatCookie(targetCookie: string, newCookie: string) {
		if (utils.isNull(targetCookie)) {
			return newCookie;
		}
		targetCookie = targetCookie.trim();
		newCookie = newCookie.trim();
		targetCookie = this.fixCookieSplit(targetCookie);
		if (newCookie.startsWith(";")) {
			newCookie = newCookie.substring(1);
		}
		return targetCookie.concat(newCookie);
	},
	/**
	 * 处理cookie
	 * @param data
	 * @returns
	 */
	handle(data: Required<HttpxDetails>) {
		if (data.fetch) {
			// fetch不做处理
			return;
		}

		if (!PopsPanel.getValue("httpx-use-cookie-enable")) {
			// 未启用
			return;
		}
		let ownCookie = "";
		if (PopsPanel.getValue("httpx-use-document-cookie")) {
			// 通过document.cookie获取添加
			ownCookie = this.concatCookie(ownCookie, document.cookie.trim());
		}

		let url = data.url;
		// 完善Url
		if (url.startsWith("//")) {
			url = window.location.protocol + url;
		}
		let urlObj = new URL(url);
		this.$data.cookieList.forEach((item) => {
			if (item.hostname.test(urlObj.hostname)) {
				// 域名匹配成功
				let cookie = PopsPanel.getValue(item.key) as string;
				if (utils.isNull(cookie)) {
					return;
				}
				ownCookie = this.concatCookie(ownCookie, cookie);
			}
		});

		if (utils.isNotNull(ownCookie)) {
			if (data.headers && data.headers["Cookie"]) {
				data.headers.Cookie = this.concatCookie(data.headers.Cookie, ownCookie);
			} else {
				data.headers["Cookie"] = ownCookie;
			}
			log.info(["Httpx => 设置cookie:", data]);
		}

		if (
			data.headers &&
			data.headers.Cookie != null &&
			utils.isNull(data.headers.Cookie)
		) {
			// 有cookie，但是cookie是空的
			// 删除该设置
			delete data.headers.Cookie;
		}
	},
};
