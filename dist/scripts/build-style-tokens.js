import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const tokens = new URL("./design-tokens.json", import.meta.url);

const tokenObj = JSON.parse(fs.readFileSync(tokens, "utf8"));

//token value 변환
const transformValue = (value, suffix, isConvertHex) => {
	//value가 참조값인 경우 var()로 변환.
	if (typeof value == "string" && value.includes("{") && value.includes("}")) {
		return value.replace(/\{([^}]+)\}/g, (match, group) => {
			const parts = group.split(".");
			return parts.length > 1 ? `var(--${parts.slice(1).join("-")})` : match;
		});
	} else if (isConvertHex) {
		let converted = value.substring(0, 7);
		return `${converted}${suffix}`;
	} else {
		//value가 절대값인 경우 그대로 리턴
		return `${value}${suffix}`;
	}
};

/**
 * CSS 토큰 문자열 생성
 * @param {string} prefixStr CSS 변수 접두사
 * @param {Object} tokenData 토큰 데이터 객체
 * @returns {string} CSS 문자열
 */
const createStyleToken = (prefixStr = "", tokenData, responsiveMode) => {
	const cssVars = [];
	const addPrefixStr = responsiveMode;
	let _suffixStr = "";
	let _isColor = false;

	const recursiveTokenObject = (prefixStr, data) => {
		if (!data || typeof data !== "object") return;
		_suffixStr = ""; //초기화
		_isColor = false;

		// 객체 항목 처리
		for (const [key, value] of Object.entries(data)) {
			if (key === "extensions") continue;
			if (typeof value !== "object" && key == "type" && value == "dimension") _suffixStr = "px";
			if (typeof value !== "object" && key == "type" && value == "color") _isColor = true;

			// 변수명 생성
			const varName = prefixStr ? (key === "value" ? prefixStr : `${prefixStr}-${key}`) : key;

			if (typeof value === "object") {
				// 재귀적으로 하위 객체 처리
				recursiveTokenObject(varName, value);
			} else if (key === "value") {
				//shadow토큰일 경우, alpha값 제거 예외
				const isShadow = varName.includes("shadow");
				//8진수 hex코드 alpha값 제거 대상 여부
				const isConvertHex = !isShadow && _isColor;
				// 값 변환 및 CSS 변수 추가
				cssVars.push(`  ${varName}: ${transformValue(value, _suffixStr, isConvertHex)};`);
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
				// responsiveMode = mainKey == "mobile" ? " .mobile" : " .pc";
				if (mainKey == "pc") continue; //pc용 제외(임시)

				Object.entries(mainValue).forEach(([subKey, subValue]) => {
					let suffix = "";
					// if (subKey === "font-size") suffix = "px";
					let prefixStr = `--${subKey}`;
					const cssBlock = createStyleToken(prefixStr, subValue, responsiveMode);
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
