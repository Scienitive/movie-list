type TIconProps = {
	width?: number | string;
	height?: number | string;
};

export function LetterboxdIcon({ width = 100, height = 100 }: TIconProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 500 500"
			fill="none"
		>
			<circle fill="#14171C" cx="250" cy="250" r="250" />
			<g transform="translate(61, 180)">
				<g>
					<ellipse
						fill="#00E054"
						cx="189"
						cy="69.973"
						rx="70.079"
						ry="69.973"
					/>
					<g transform="translate(248.153, 0)">
						<ellipse
							fill="#40BCF4"
							cx="59.769"
							cy="69.973"
							rx="70.079"
							ry="69.973"
						/>
					</g>
					<g>
						<ellipse
							fill="#FF8000"
							cx="70.079"
							cy="69.973"
							rx="70.079"
							ry="69.973"
						/>
					</g>
					<path
						d="M129.539 107.022 C122.810 96.278 118.921 83.579 118.921 69.973 C118.921 56.367 122.810 43.668 129.539 32.924 C136.268 43.668 140.157 56.367 140.157 69.973 C140.157 83.579 136.268 96.278 129.539 107.022 Z"
						fill="#556677"
					/>
					<path
						d="M248.461 32.924 C255.190 43.668 259.079 56.367 259.079 69.973 C259.079 83.579 255.190 96.278 248.461 107.022 C241.732 96.278 237.843 83.579 237.843 69.973 C237.843 56.367 241.732 43.668 248.461 32.924 Z"
						fill="#556677"
					/>
				</g>
			</g>
		</svg>
	);
}
