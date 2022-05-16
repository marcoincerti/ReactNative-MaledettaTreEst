import React, { Component } from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

const Separator = () => (
    <View style={styles.separator} />
  );

class Row extends React.Component {
    render() { 
        const line = this.props.data["item"]
        const nameLine = line["terminus1"]["sname"] + " - " + line["terminus2"]["sname"]
        return <View style={styles.rowStyle}>
        <Separator/>
        <Text style={{fontSize:25, fontWeight:'300'}}>Linea</Text>
        <Text style={styles.lineName}>{nameLine}</Text>
        <Separator/>
        <TouchableOpacity
        activeOpacity={0.7}
        style={styles.directionBtnStyle}
        onPress={() => this.props.handleLineClick(line["terminus1"], line["terminus2"])}>
            <Text style={styles.directionBtnTextStyle}>{"Direzione " + line["terminus1"]["sname"]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            activeOpacity={0.7}
            style={styles.directionBtnStyle}
            onPress={() => this.props.handleLineClick(line["terminus2"], line["terminus1"])}>
                <Text style={styles.directionBtnTextStyle}>{"Direzione " + line["terminus2"]["sname"]}</Text>
        </TouchableOpacity>
        <Separator/>
    </View>;
    }


}

 
const styles = StyleSheet.create({
    lineName:{
        marginTop: 10,
        fontSize: 18,
        color: "#656CEE",
        fontWeight: 'bold'
    },
    rowStyle:{
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
            shadowOffset: {
              width: 1.5,
              height: 1.5,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 2,
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 10,
            margin: 10,
    },
    directionStyle:{
        fontSize: 15
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    directionBtnStyle:{
        marginLeft: 10,
        marginRight:10,
        marginTop:20,
        width: "80%",
        height: 40,
        justifyContent: 'center',

        elevation: 1,
        backgroundColor: '#F8A059',
        borderRadius: 20,
    },
    directionBtnTextStyle:{
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500'
    },
  });
export default Row;