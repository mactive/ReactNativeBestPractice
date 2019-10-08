import { createAppContainer, createStackNavigator } from "react-navigation";

import { MainScreen } from "./MainScreen";
import { FindFoodScreen } from "./pages/FindFood/ShakeRotate";
import { TheoryRenderScreen } from "./pages/RNTheory/TheoryRenderScreen";
import { CardScreen } from "./pages/AdvanceGesture/CardScreen";

const mainNavigator = createStackNavigator({
	Main: { screen: MainScreen },
	CardScreen: { screen: CardScreen },
	TheoryRender: { screen: TheoryRenderScreen },
	FindFood: { screen: FindFoodScreen },
});

export default createAppContainer(mainNavigator);

