import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default function FirstPage() {

    return (
      <View>
            <Pressable
                style={[styles.bichatFillParent, styles.blob11Position]}
            >
                {/* <Image
                style={styles.bichatFillIcon}
                contentFit="cover"
                source={require("../assets/bichatfill.png")}
                /> */}
                <Text style={styles.text}>카카오로 로그인하기</Text>
            </Pressable>
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
});
