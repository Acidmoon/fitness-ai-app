import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
}

export function AppNavigator({ isLoggedIn, onLoginSuccess }: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomePage} />
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginPage
                  onLoginSuccess={onLoginSuccess}
                  onNavigateRegister={() =>
                    props.navigation.navigate("Register")
                  }
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register">
              {(props) => (
                <RegisterPage
                  onNavigateLogin={() => props.navigation.navigate("Login")}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
