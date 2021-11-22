import React, { useRef } from "react";
import "./JsonViewer.scss";

type Props = {
	data: object;
};

export function JsonViewer({ data }: Props) {
	const ref = useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (ref.current) {
			let lines = JSON.stringify(data, null, 4).split("\n");
			lines = lines.map((str) => {
				let old = str;
				let altered = false;
				str = str.replace(/( [{}[]],?$)/g, "<span class='object'>$1</span>");
				if (old !== str) {
					altered = true;
					old = str;
				}

				str = str.replace(/("[a-zA-Z0-9\\ /_\-{}$]+"):/g, "<span class='key'>$1</span>:");
				if (old !== str) {
					altered = true;
					old = str;
				}

				str = str.replace(/:.*(".*")/g, ": <span class='string'>$1</span>");
				if (old !== str) {
					altered = true;
					old = str;
				}

				str = str.replace(/: ([0-9]+\.?[0-9]*)/g, ": <span class='number'>$1</span>");
				if (old !== str) {
					altered = true;
					old = str;
				}

				str = str.replace(/:.*(true|false)/g, ": <span class='boolean'>$1</span>");
				if (old !== str) {
					altered = true;
					old = str;
				}

				str = str.replace(/:.*(null)/g, ": <span class='null'>$1</span>");
				if (old !== str) {
					altered = true;
					old = str;
				}

				// array time !

				if (!altered) {
					str = str.replace(/( +)(".*")/g, "$1<span class='string'>$2</span>");
					if (old !== str) {
						altered = true;
						old = str;
					}
				}

				if (!altered) {
					str = str.replace(/( +)([0-9]+.?[0-9]*)/g, "$1<span class='number'>$2</span>");
					if (old !== str) {
						altered = true;
						old = str;
					}
				}

				if (!altered) {
					str = str.replace(/( +)(true|false)/g, "$1<span class='boolean'>$2</span>");
					if (old !== str) {
						altered = true;
						old = str;
					}
				}

				return str;
			});

			ref.current.innerHTML = `<pre>${lines.join("\n")}</pre>`;
		}
	}, [ref, data]);

	return <div className={"JsonViewer"} ref={ref} />;
}
