import { createAppContainer, createStackNavigator } from "react-navigation";

import { MainScreen } from "./MainScreen";
import { FindFoodScreen } from "./pages/FindFood";

const mainNavigator = createStackNavigator({
	Main: { screen: MainScreen },
	FindFood: { screen: FindFoodScreen },
});

export default createAppContainer(mainNavigator);

