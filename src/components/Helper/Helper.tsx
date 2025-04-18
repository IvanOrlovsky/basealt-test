import "./Helper.css";

export function Helper() {
	return (
		<div className="helper-wrapper">
			<div className="helper-container">
				<ul className="helper-list">
					<span className="helper-text">Цвета веток</span>
					<li>
						<div
							className="circle"
							style={{ backgroundColor: "#FFFFFF" }}
						></div>
						<span className="helper-text">sisyphus</span>
					</li>
					<li>
						<div
							className="circle"
							style={{ backgroundColor: "#F5F5F5" }}
						></div>
						<span className="helper-text">p11</span>
					</li>
					<li>
						<div
							className="circle"
							style={{ backgroundColor: "#ADD8E6" }}
						></div>
						<span className="helper-text">p10</span>
					</li>
					<li>
						<div
							className="circle"
							style={{ backgroundColor: "#FFF47F" }}
						></div>
						<span className="helper-text">p9</span>
					</li>
					<li>
						<div
							className="circle"
							style={{ backgroundColor: "#FFD1DC" }}
						></div>
						<span className="helper-text">c10f2</span>
					</li>
					<li>
						<div
							className="circle"
							style={{ backgroundColor: "#ECFFDC" }}
						></div>
						<span className="helper-text">c9f2</span>
					</li>
				</ul>
			</div>
		</div>
	);
}
