import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Main App Stack Navigation Types
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  CreatePost: {
    photoUri: string;
    isBeforePhoto: boolean;
  };
  Comments: {
    postId: string;
  };
};

// Bottom Tab Navigation Types
export type MainTabParamList = {
  Feed: undefined;
  Map: undefined;
  Camera: undefined;
  Challenges: undefined;
  Profile: undefined;
};

// Auth Stack Navigation Types
export type AuthStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Login: undefined;
  ProfileSetup: undefined;
  MainApp: NavigatorScreenParams<MainStackParamList>;
};

// Screen Props Types
export type MainStackScreenProps<T extends keyof MainStackParamList> = 
  NativeStackScreenProps<MainStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

// Navigation Props
export type MainStackNavigationProp = MainStackScreenProps<keyof MainStackParamList>['navigation'];
export type MainTabNavigationProp = MainTabScreenProps<keyof MainTabParamList>['navigation'];
export type AuthStackNavigationProp = AuthStackScreenProps<keyof AuthStackParamList>['navigation'];
