import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RecordsPage } from "../pages/RecordsPage";
import { RegisterPage } from "../pages/RegisterPage";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Records: undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Dashboard: "📊",
    Records: "📋",
    Profile: "👤",
  };
  return (
    <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>
      {icons[label] ?? "•"}
    </Text>
  );
}

interface Props {
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export function AppNavigator({ isLoggedIn, onLoginSuccess, onLogout }: Props) {
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon label={route.name} focused={focused} />
            ),
            tabBarActiveTintColor: "#1a1a2e",
            tabBarInactiveTintColor: "#adb5bd",
            tabBarStyle: {
              backgroundColor: "#ffffff",
              borderTopColor: "#e9ecef",
            },
          })}
        >
          <MainTab.Screen
            name="Dashboard"
            component={HomePage}
            options={{ tabBarLabel: "仪表盘" }}
          />
          <MainTab.Screen
            name="Records"
            component={RecordsPage}
            options={{ tabBarLabel: "训练记录" }}
          />
          <MainTab.Screen
            name="Profile"
            options={{ tabBarLabel: "个人中心" }}
          >
            {() => <ProfilePage onLogout={onLogout} />}
          </MainTab.Screen>
        </MainTab.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login">
            {(props) => (
              <LoginPage
                onLoginSuccess={onLoginSuccess}
                onNavigateRegister={() =>
                  props.navigation.navigate("Register")
                }
              />
            )}
          </AuthStack.Screen>
          <AuthStack.Screen name="Register">
            {(props) => (
              <RegisterPage
                onNavigateLogin={() => props.navigation.navigate("Login")}
              />
            )}
          </AuthStack.Screen>
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
