const l = require("fs"),
	f = "dtt.json",
	i = "dtt.scss";
l.readFile(f, "utf8", (t, a) => {
	if (t) {
		console.error("JSON 파일을 읽을 수 없습니다:", t);
		return;
	}
	try {
		let o = function (e, c = "") {
			for (const s in e)
				typeof e[s] == "object" &&
					(e[s].value !== void 0
						? (r += `$${c}-${s}: ${e[s].value};
`)
						: o(e[s], `${c}-${s}`));
		};
		var u = o;
		const n = JSON.parse(a);
		let r = "";
		o(n),
			l.writeFile(i, r, e => {
				e ? console.error("Sass 파일을 생성할 수 없습니다:", e) : console.log("Sass 파일이 성공적으로 생성되었습니다:", i);
			});
	} catch (n) {
		console.error("JSON 데이터를 파싱할 수 없습니다:", n);
	}
});
