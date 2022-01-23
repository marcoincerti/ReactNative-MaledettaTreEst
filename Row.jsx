import React from 'react';
import { StyleSheet, Button, Text, View, TouchableOpacity } from 'react-native';

class Row extends React.Component {

    render() {
        let l = this.props.data.item;
        return (
            <View style={this.styles.container}>
                <Text style={this.styles.subTitle}>{"da " + l.terminus1.sname + " a " + l.terminus2.sname}</Text>
                <TouchableOpacity style={this.styles.button} onPress={() => this.props.onSelection(l, l.terminus1, true)}><Text>{l.terminus1.sname}</Text></TouchableOpacity>
                <TouchableOpacity style={this.styles.button} onPress={() => this.props.onSelection(l, l.terminus2, true)}><Text>{l.terminus2.sname}</Text></TouchableOpacity>

                <Button title='Mappa delle stazioni' style={this.styles.mappa} onPress={() => this.props.onSelection(l, l.terminus2, false)}></Button>
            </View>
        )
    }

    styles = StyleSheet.create({
        subTitle: {
            fontSize: 20,
            paddingTop: 10,
        },
        mappa: {
            margin: 10,
          },
        button: {
            alignItems: "center",
            backgroundColor: "#DDDDDD",
            padding: 10,
            width: 400
        },
        container: {
            flex: 1,
            justifyContent: "space-between",
            alignItems: "center",

        }
    });
}



export default Row;