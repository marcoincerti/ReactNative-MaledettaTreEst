import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, StyleSheet, SafeAreaView, ActivityIndicator, FlatList, View, Alert } from 'react-native';
import Row from '../Row';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CommunicationController from '../CommunicationController';
import StorageManager from '../StorageManager';


class BachecaUno extends React.Component {

  state = {
    jsonData: null,
    page: "first",
    sid: "",
    toShow: {},
    direction: {}
  }

  showAlert = () => {
    Alert.alert(
      'Non hai una connesione internet!'
    );
  }

  async checkFirstRun() {
    const secondRun = await AsyncStorage.getItem("second_run");
    if (secondRun === "true") {
      //console.log("Second run");
    } else {
      //console.log("first run");
      var sid;
      sid = await CommunicationController.register().then(result => {
        return result.sid;
      }).catch(error => {
        console.log(error);
        this.showAlert();
      });
      this.state.sid = sid;
      this.setState(this.state);
      await AsyncStorage.setItem("sid", sid);
      await AsyncStorage.setItem("second_run", "true");
    }
    return secondRun === "true"
  }

  async checkBacheca() {
    const line = await AsyncStorage.getItem("line");
    //console.log(line);
    if (line !== null) {
      try {
        const direction = await AsyncStorage.getItem("direction");
        this.handleSelection(JSON.parse(line), JSON.parse(direction), true);
        console.log("Dovrebbe funzionare")
      } catch (error) {
        console.log(error)
      }
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('sid')
      if (value !== null) {
        this.state.sid = value;
        //console.log(this.state.sid);
        this.setState(this.state);
        //retrieve lines
        CommunicationController.getLines(this.state.sid)
          .then(unmarshalledObj => {
            this.state.jsonData = unmarshalledObj.lines;
            this.setState(this.state);
            this.checkBacheca();
            console.log("ciaoooooo");
          })
          .catch(error => {
            console.log(error);
            this.showAlert();
          });
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  }

  handleSelection = (line, direction, bool) => {
    if (bool) {
      this.props.navigation.navigate('BachecaDue', {
        sid: this.state.sid,
        line: line,
        direction: direction,
      });
    } else {
      this.props.navigation.navigate('Mappa', {
        sid: this.state.sid,
        direction: direction,
      });
    }
  }

  componentDidMount() {
    this.checkFirstRun().then(result => {
      //manage second access
      if (result == "true") {
        //console.log("PRIMO ACCESSO")
      } else {
        //console.log("SECONDO ACCESSO");
        this.getData();
      }
    });

    let sm = new StorageManager();
    sm.initDB(
      result => console.log("risultato", result),
      error => console.log("error", error)
    );
  }

  render() {
    if (this.state.jsonData != null) {
      return (
        <SafeAreaView>
          <View style={this.styles.padding}>
            <Text style={this.styles.title}>Bacheca tratte</Text>
            <FlatList
              data={this.state.jsonData}
              renderItem={(item) => { return (<Row data={item} onSelection={this.handleSelection} />) }}
              keyExtractor={item => item.terminus1.sname + " " + item.terminus2.sname}
            />
          </View>
          <StatusBar styles="auto" />
        </SafeAreaView>
      )
    } else {
      return <View style={[this.styles.container, this.styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    }
  }

  styles = StyleSheet.create({
    title: {
      fontSize: 36,
      paddingTop: 20,
    },
    subTitle: {
      fontSize: 20,
      paddingTop: 10,
    },
    button: {
      backgroundColor: "#DDDDDD",
      padding: 10,
      width: 400
    },
    container: {
      flex: 1,
      justifyContent: "center"
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
    padding: {
      padding: 20
    }

  });
}

export default BachecaUno;