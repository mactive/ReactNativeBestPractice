import { createAppContainer, createStackNavigator } from "react-navigation";

import { MainScreen } from "./MainScreen";
import { FindFoodScreen } from "./pages/FindFood";
import { TheoryRenderScreen } from "./pages/RNTheory/TheoryRenderScreen";
import { CardScreen } from "./pages/AdvanceGesture/CardScreen.tsx";

const mainNavigator = createStackNavigator({
	CardScreen: { screen: CardScreen },
	TheoryRender: { screen: TheoryRenderScreen },
	Main: { screen: MainScreen },
	FindFood: { screen: FindFoodScreen },
});

export default createAppContainer(mainNavigator);

