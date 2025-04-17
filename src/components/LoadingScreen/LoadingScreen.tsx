import { LoadingScreenProps } from "./types";
import { Spinner } from "@patternfly/react-core";
import "./LoadingScreen.css";

export function LoadingScreen({ text }: LoadingScreenProps) {
	return (
		<main>
			<Spinner size="xl" />
			<span>{text}</span>
		</main>
	);
}
