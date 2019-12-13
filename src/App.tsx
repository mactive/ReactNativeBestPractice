import { createAppContainer, createStackNavigator } from "react-navigation";

import { MainScreen } from "./MainScreen";
import { ShakeRotateScreen } from "./pages/AdvanceGesture/ShakeRotate";
import { FindFoodScreen } from "./pages/FindFood/FindFood";
import { TheoryRenderScreen } from "./pages/RNTheory/TheoryRenderScreen";
import { CardScreen } from "./pages/AdvanceGesture/CardScreen";

const mainNavigator = createStackNavigator({
	Main: { screen: MainScreen },
	CardScreen: { screen: CardScreen },
	TheoryRender: { screen: TheoryRenderScreen },
	FindFood: { screen: FindFoodScreen },
	ShakeRotateScreen: { screen: ShakeRotateScreen },
});

export default createAppContainer(mainNavigator);

