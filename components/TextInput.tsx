import { View, Text, TextInput as MyTextInput, StyleSheet } from 'react-native'
import React from 'react'


const TextInput = () => {
  return (
    <View style={styles.container}>
      <MyTextInput />
    </View>
  )
}

export default TextInput

const styles = StyleSheet.create({

    container: {
      borderColor: 'gray',
      borderWidth : 1,
      padding: 16,
      borderRadius: 8
    },

  });