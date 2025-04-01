import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const tokens = new URL("./design-tokens.json", import.meta.url);

const tokenObj = JSON.parse(fs.readFileSync(tokens, "utf8"));

//token value 변환
const transformValue = value => {
	//value가 참조값인 경우 var()로 변환.
	if (typeof value == "string" && value.includes("{") && value.includes("}")) {
		return value.replace(/\{([^}]+)\}/g, (match, group) => {
			const parts = group.split(".");
			return parts.length > 1 ? `var(--${parts.slice(1).join("-")})` : match;
		});
	} else {
		//value가 절대값인 경우 그대로 리턴
		return value;
	}
};

/**
 * CSS 토큰 문자열 생성
 * @param {string} prefixStr CSS 변수 접두사
 * @param {Object} tokenData 토큰 데이터 객체
 * @returns {string} CSS 문자열
 */
const createStyleToken = (prefixStr = "", tokenData, responsiveMode, suffixStr = "") => {
	const cssVars = [];
	const addPrefixStr = responsiveMode;
	let _suffixStr = suffixStr;

	const recursiveTokenObject = (prefixStr, data) => {
		if (!data || typeof data !== "object") return;

		// 객체 항목 처리
		for (const [key, value] of Object.entries(data)) {
			if (key === "extensions") continue;

			// 변수명 생성
			const varName = prefixStr ? (key === "value" ? prefixStr : `${prefixStr}-${key}`) : key;

			if (typeof value === "object") {
				// 재귀적으로 하위 객체 처리
				recursiveTokenObject(varName, value);
			} else if (key === "value") {
				// 값 변환 및 CSS 변수 추가
				cssVars.push(`  ${varName}: ${transformValue(value)}${_suffixStr};`);
			}
		}
	};

	recursiveTokenObject(prefixStr, tokenData);

	// CSS 변수가 없으면 빈 문자열 반환
	if (cssVars.length === 0) return "";

	return `:root${addPrefixStr} {\n${cssVars.join("\n")}\n}\n`;
};

//css 제너레이터
const generateThemeCssVariables = tokenData => {
	const cssBlocks = [];

	for (const [_, categoryData] of Object.entries(tokenData)) {
		for (const [mainKey, mainValue] of Object.entries(categoryData)) {
			let responsiveMode = "";
			if (mainKey == "mobile" || mainKey == "pc") {
				responsiveMode = mainKey == "mobile" ? " .mobile" : " .pc";

				Object.entries(mainValue).forEach(([subKey, subValue]) => {
					let suffix = "";
					if (subKey === "font-size") suffix = "px";
					let prefixStr = `--${subKey}`;
					const cssBlock = createStyleToken(prefixStr, subValue, responsiveMode, suffix);
					if (cssBlock) {
						cssBlocks.push(cssBlock);
					}
				});
			} else {
				let prefixStr = `--${mainKey}`;
				const cssBlock = createStyleToken(prefixStr, mainValue, responsiveMode);
				if (cssBlock) {
					cssBlocks.push(cssBlock);
				}
			}
		}
	}

	return cssBlocks.join("\n");
};

//파일 생성
const generateThemeCss = () => {
	const variables = generateThemeCssVariables(tokenObj);

	const distDir = path.join(__dirname, "../src/css");

	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir, { recursive: true });
	}
	fs.writeFileSync(`${distDir}/theme.scss`, variables, "utf8");
};

generateThemeCss();
