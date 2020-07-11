import React, { useState, useEffect } from "react";
import { StyleSheet, StatusBar, View, Text, Platform } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import Constants from "expo-constants";

export default function Status() {
  const [isConnected, setIsConnected] = useState(true);
  const backgroundColor = isConnected
    ? { backgroundColor: "white" }
    : { backgroundColor: "red" };
  const barStyle = isConnected ? "dark-content" : "light-content";

  // on mount, add a network connectivity change listener, set cnxn
  /*
	useEffect(()=> {
		const handleChange = (connected) => {
			setIsConnected(connected)
		}

		async function fetchConnectivity() {
			NetInfo.addEventListener(handleChange)
			try {
				const connected = await NetInfo.isConnected.fetch()
				setIsConnected(connected)
			} catch (e) {
				console.log("there was an error: ", e)
			}
		}
		fetchConnectivity()
		// function to clear event listener at unmount
		return () => {NetInfo.removeEventListener(handleChange)}
	}, [isConnected])
	*/

  const netInfo = useNetInfo();

  // we set backgroundColor here for android. ios will ignore.
  const statusBar = (
    <StatusBar
      backgroundColor={backgroundColor}
      barStyle={barStyle}
      animated={false}
    />
  );

  // statusBar configures, doesn't actually render text
  // can be included anywhere in component hierarchy
  const messageContainer = (
    <View style={styles.messageContainer} pointerEvents={"none"}>
      {statusBar}
      {!netInfo.isConnected && (
        <View style={styles.bubble}>
          <Text style={styles.text}>No network connection</Text>
        </View>
      )}
    </View>
  );

  // what's returned from Status component
  if (Platform.OS === "ios") {
    return (
      <View style={[styles.status, backgroundColor]}>{messageContainer}</View>
    );
  }

  return { messageContainer };
}

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : 0;

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: "absolute",
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: "center",
  },
  bubble: {
    backgroundColor: "red",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    color: "white",
  },
});
