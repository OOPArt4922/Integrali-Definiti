//#region Loading LocalStorage Data

const funcLatex = localStorage.getItem("funcLatex") === "" ? "x^2" : localStorage.getItem("funcLatex") ?? "x^2";
$("#plotSlider")
	.val(JSON.parse(localStorage.getItem("sliderVal")) ?? 2)
	.change();
$("#plotSlider").on("input", changeSlider);
$("#sliderLabel").text(`Numero di suddivisioni: ${$("#plotSlider").val()}`);

let [a, b] = [JSON.parse(localStorage.getItem("rangeA")) ?? 0, JSON.parse(localStorage.getItem("rangeB")) ?? 1];
$("#range span:nth-child(1)").text(a);
$("#range span:nth-child(2)").text(b);

//#endregion Loading LocalStorage Data

//#region Plot Expressions Loading

const plot = Desmos.GraphingCalculator(document.querySelector("#plot"), {
	keypad: false,
	expressions: false,
	settingsMenu: false,
});

plot.setState({
	expressions: {
		list: [
			{ type: "expression", id: "function", latex: `f(x)=${funcLatex}`, color: Desmos.Colors.BLUE },
			{ type: "expression", id: "subdivisions", latex: `n=${$("#plotSlider").val()}` },
			{ type: "expression", id: "sub_list", latex: "i=[1...n]" },
			//#region Range
			{ id: "range_folder", title: "range_folder", type: "folder" },
			{
				type: "expression",
				id: "slider_A",
				latex: `a=${a}`,
				slider: { hardmax: true, hardmin: true, min: -1000, max: 1000, step: 0.1 },
				folderId: "range_folder",
			},
			{ type: "expression", id: "vertical_A", latex: "x=a", color: Desmos.Colors.GREEN, folderId: "range_folder" },
			{
				type: "expression",
				id: "point_A",
				latex: "(a, 0)",
				color: Desmos.Colors.GREEN,
				label: "a",
				showLabel: true,
				folderId: "range_folder",
			},
			{
				type: "expression",
				id: "slider_B",
				latex: `b=${b}`,
				slider: { hardmax: true, hardmin: true, min: -1000, max: 1000, step: 0.1 },
				folderId: "range_folder",
			},
			{ type: "expression", id: "vertical_B", latex: "x=b", color: Desmos.Colors.GREEN, folderId: "range_folder" },
			{
				type: "expression",
				id: "point_B",
				latex: "(b, 0)",
				color: Desmos.Colors.GREEN,
				label: "b",
				showLabel: true,
				folderId: "range_folder",
			},
			//#endregion Range
			//#region Area
			{ id: "area_folder", title: "area_folder", type: "folder" },
			{
				type: "expression",
				id: "positive_area",
				latex: "0\\le y\\le f\\left(x\\right)\\left\\{\\left(a-x\\right)\\left(b-x\\right)<0\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "area_folder",
			},
			{
				type: "expression",
				id: "negative_area",
				latex: "f\\left(x\\right)\\le y\\le0\\left\\{\\left(a-x\\right)\\left(b-x\\right)<0\\right\\}",
				color: Desmos.Colors.BLUE,
				folderId: "area_folder",
			},
			//#endregion Area
			//#region Approximations
			{ id: "approx_folder", title: "approx_folder", type: "folder" },
			{
				type: "expression",
				id: "sum(infsup)_list",
				latex:
					"S_{infsup}=\\left[\\sum_{j=1}^{n}f\\left(a+\\left(j-1\\right)\\left(\\frac{b-a}{n}\\right)\\right)\\left(\\frac{b-a}{n}\\right),\\sum_{j=1}^{n}f\\left(a+j\\left(\\frac{b-a}{n}\\right)\\right)\\left(\\frac{b-a}{n}\\right),\\int_{a}^{b}f\\left(x\\right)dx\\right]",
				folderId: "approx_folder",
			},
			{
				type: "expression",
				id: "sum(mid)_list",
				latex:
					"S_{mid}=\\left[\\sum_{j=1}^{n}f\\left(a+\\left(j-\\frac{1}{2}\\right)\\left(\\frac{b-a}{n}\\right)\\right)\\left(\\frac{b-a}{n}\\right),\\int_{a}^{b}f\\left(x\\right)dx\\right]",
				folderId: "approx_folder",
			},
			{
				type: "expression",
				id: "sum(trap)_list",
				latex:
					"S_{trap}=\\left[\\left(\\frac{b-a}{n}\\right)\\left(\\frac{f\\left(a\\right)+f\\left(b\\right)}{2}+\\sum_{j=0}^{n-1}f\\left(a+j\\left(\\frac{b-a}{n}\\right)\\right)\\right),\\int_{a}^{b}f\\left(x\\right)dx\\right]",
				folderId: "approx_folder",
			},
			//#endregion Approximations
			{
				type: "expression",
				id: "delta_x",
				latex: "\\Delta_{x}=\\left(i-1\\right)\\frac{\\max\\left(b,a\\right)-\\min\\left(b,a\\right)}{n}",
				hidden: true,
			},
			{
				type: "expression",
				id: "delta_X",
				latex: "\\Delta_{X}=i\\frac{\\max\\left(b,a\\right)-\\min\\left(b,a\\right)}{n}",
				hidden: true,
			},
			//#region Rectangles (Inferior and Superior Sums)
			{ id: "rect_folder (sup and inf)", title: "rect_folder (sup and inf)", type: "folder" },
			{
				type: "expression",
				id: "big_rect",
				latex:
					"\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "big_rect_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "big_rect_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "small_rect",
				latex:
					"\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.GREEN,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "small_rect_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.GREEN,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "small_rect_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.GREEN,
				folderId: "rect_folder (sup and inf)",
			},
			//#endregion Rectangles (Inferior and Superior Sums)
			//#region Rectangles (Middle Point Sum)
			{ id: "rect_folder (mid)", title: "rect_folder (mid)", type: "folder" },
			{
				type: "expression",
				id: "mid_rect",
				latex:
					"\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.PURPLE,
				folderId: "rect_folder (mid)",
			},
			{
				type: "expression",
				id: "mid_rect_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\right\\}",
				color: Desmos.Colors.PURPLE,
				folderId: "rect_folder (mid)",
			},
			{
				type: "expression",
				id: "mid_rect_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\frac{\\Delta_{x}+\\Delta_{X}}{\\min\\left(b,a\\right)+2}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\frac{\\min\\left(b,a\\right)+\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\right\\}",
				color: Desmos.Colors.PURPLE,
				folderId: "rect_folder (mid)",
			},
			//#endregion Rectangles (Middle Point Sum)
			//#region Trapezes
			{ id: "trap_folder", title: "trap_folder", type: "folder" },
			{
				type: "expression",
				id: "trap",
				latex:
					"\\min\\left(0,f\\left(\\Delta_{x}\\right)\\left(\\frac{x-\\min\\left(b,a\\right)-\\Delta_{X}}{\\Delta_{x}-\\Delta_{X}}\\right)+f\\left(\\Delta_{X}\\right)\\left(\\frac{x-\\min\\left(b,a\\right)-\\Delta_{x}}{\\Delta_{X}-\\Delta_{x}}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\Delta_{x}\\right)\\left(\\frac{x-\\min\\left(b,a\\right)-\\Delta_{X}}{\\Delta_{x}-\\Delta_{X}}\\right)+f\\left(\\Delta_{X}\\right)\\left(\\frac{x-\\min\\left(b,a\\right)-\\Delta_{x}}{\\Delta_{X}-\\Delta_{x}}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.ORANGE,
				folderId: "trap_folder",
			},
			{
				type: "expression",
				id: "trap_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.ORANGE,
				folderId: "trap_folder",
			},
			{
				type: "expression",
				id: "trap_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.ORANGE,
				folderId: "trap_folder",
			},
			//#endregion Trapezes
		],
	},
	graph: {
		viewport: {
			xmin: -2,
			xmax: 2,
			ymin: -1,
			ymax: 2,
		},
	},
	version: 7,
	randomSeed: "",
});
plot.newRandomSeed();

//#endregion Plot Expressions Loading

//#region Helper Expressions

const hAB = plot.HelperExpression({ latex: "[a, b]" });
hAB.observe("listValue", () => {
	a = hAB.listValue[0];
	b = hAB.listValue[1];
	$("#range span:nth-child(1)").text(a);
	$("#range span:nth-child(2)").text(b);
	localStorage.setItem("rangeA", a);
	localStorage.setItem("rangeB", b);
});

const hS = plot.HelperExpression({ latex: "S_{infsup}" });
hS.observe("listValue", () => {
	if (hS.listValue) {
		let [s, S, I] = !isNaN(hS.listValue[2])
			? [hS.listValue[0].toFixed(10), hS.listValue[1].toFixed(10), hS.listValue[2].toFixed(10)]
			: ["Intervallo non valido", "Intervallo non valido", "Intervallo non valido"];

		if (I == 0) [s, S, I] = [0, 0, 0];

		$("#result").html(
			`<span style="color: #60b030">S<sub>n</sub>: ${s}</span><br>
			<span style="color: #ff5060">S<sub>N</sub>: ${S}</span><br>
			<span style="color: #6050ff">Valore Reale: ${I}</span><br>`
		);

		plot.setExpression({
			id: "rect_folder (sup and inf)",
			hidden: isNaN(hS.listValue[2]),
		});
	}
});

//#endregion Helper Expressions

//#region Mathquill Editor Settings

const answerMathField = MathQuill.getInterface(2).MathField(document.querySelector("#latex"), {
	handlers: {
		edit: () => {
			plot.setExpression({ id: "function", latex: `f(x)=${answerMathField.latex()}` });
			localStorage.setItem("funcLatex", answerMathField.latex());
		},
	},
});
answerMathField.latex(funcLatex);

//#endregion Mathquill Editor Settings

//#region Arrow Buttons Code

let timeout, interval;
$("#slider .button").on("mousedown", e => {
	sliderButtons(e);
	changeSlider();

	timeout = setTimeout(() => {
		interval = setInterval(() => {
			sliderButtons(e);
			changeSlider();
		}, 50);
	}, 300);
});
$(".button").on("mouseup mouseleave", () => {
	clearTimeout(timeout);
	clearInterval(interval);
});

//#endregion Arrow Buttons Code

//#region Helper functions

function changeSlider() {
	let v = $("#plotSlider").val();
	localStorage.setItem("sliderVal", v);
	plot.setExpression({ id: "subdivisions", latex: `n=${v}` });
	$("#sliderLabel").text(`Numero di suddivisioni: ${v}`);
}

function sliderButtons(e) {
	$("#plotSlider")
		.val((_, c) => ($(e.currentTarget).children().hasClass("right") ? +c + 1 : +c - 1))
		.change();
}

//#endregion Helper functions
