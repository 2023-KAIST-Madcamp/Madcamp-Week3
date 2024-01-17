import React, { Component } from 'react'
import { Text, View, StyleSheet , Pressable, Image} from 'react-native'
import LottieView from "lottie-react-native";

export default function FirstPage({navigation}) {
    const handleLogin = ()=> {
        navigation.navigate('Login')
    }
    return (
      <View style={styles.start}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
            <Image source={require("../assets/devtoday_logo.png")} />
              <LottieView source={require("../assets/cpu.json")} autoPlay loop style={{ height: 160 }} />
            <Pressable
                style={[styles.bichatFillParent, styles.blob11Position]}
                onPress={()=> handleLogin()}
            >
                <Text style={styles.text}>카카오로 로그인하기</Text>
            </Pressable>
        </View>
    </View>
    )
}
const styles = StyleSheet.create({

text: {
    fontSize: 14,
    fontWeight: "700",
    // fontFamily: FontFamily.nanumSquareRound,
    color: 'black',
    textAlign: "left",
    marginLeft: 10,
  },
  start: {
    backgroundColor: '#121212',
    flex: 1,
    width: "100%",
    height: 640,
    overflow: "hidden",
  },
  bichatFillParent: {
    marginTop: 0,
    marginLeft: 0,
    top: "50%",
    borderRadius: 10,
    backgroundColor: "#fae300",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: "hidden",
    width: 200
  },
});
