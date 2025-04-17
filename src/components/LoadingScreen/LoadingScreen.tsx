import { LoadingScreenProps } from "./types";
import { Spinner } from "@patternfly/react-core";
import "./LoadingScreen.css";

export function LoadingScreen({ text }: LoadingScreenProps) {
	return (
		<main className="loading-screen">
			<Spinner size="xl" />
			<span className="loading-screen-text">{text}</span>
		</main>
	);
}
