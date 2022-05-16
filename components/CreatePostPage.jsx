import React, { Component } from 'react';
import { StatusBar, Button, Text, View, StyleSheet, SafeAreaView, TouchableOpacity, Image, TextInput, Picker} from 'react-native';
import CommunicationController from '../CommunicationController';
import { MyContext } from '../context.js';

const delay_values = ["", "In Orario", "Di pochi minuti", "Oltre 15 minuti", "Treni Soppressi"]
const status_values = ["", "Situazione ideale", "Accettabile", "Gravi problemi per i passeggeri"]

class CreatePostPage extends React.Component {
    static contextType = MyContext

    state = {
        sid : -1,
        did : -1,
        departure : "",
        arrival : "",
        delay : 0,
        status : 0,
        comment : "",
    }

    componentDidMount(){
        this.state.sid = this.context.sid
        const { did, departure, arrival } = this.props.route.params;
        this.state.did = did
        this.state.departure = departure
        this.state.arrival = arrival
        this.setState(this.state)        
    }

    setSelectedDelay(itemValue){
        // console.log(itemValue)
        this.state.delay = itemValue //attenzione che dal Picker lo 0 equivale alla scelta vuota e non alla prima scelta prevista dal sistema
        this.setState(this.state)
    }

    setSelectedStatus(itemValue){
        // console.log(itemValue)
        this.state.status = itemValue
        this.setState(this.state)
    }

    render() { 
        if(this.state.did != -1)
        {
            return <View style={styles.container}>
                <View style={styles.infoStyle}>
                    <View style={styles.infoDirectionStyle}>
                        <Text style={{textAlign:'left', flex:1, marginLeft:6}}>Partenza</Text>
                        <Text style={{textAlign:'right', flex:1, marginRight:6}}>Arrivo</Text>
                    </View>
                    <View style={styles.infoDirectionStyle}>
                        <Text style={[styles.directionStyle, {textAlign:'left'}]}>{this.state.departure}</Text>
                        <Image
                            source={require('../assets/icon-train.png')}
                            style={styles.imgStyle}
                        />
                    <Text style={[styles.directionStyle, {textAlign:'right'}]}>{this.state.arrival}</Text>
                    </View>
                </View>
                <View style={styles.infoStyle}>
                    <Text style={styles.infoCreatePost}>Commento:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={this.onChangeComment}
                        placeholder="Digita Commento minore di 100 caratteri"
                    />
                    <View style={styles.rowInputStyle}>
                        <Text style={styles.infoCreatePost}>Ritardo:</Text>
                        <Picker
                        selectedValue={delay_values[this.state.delay]}
                        style={styles.inputPicker}
                        itemStyle={styles.pickerItemStyle}
                        onValueChange={(itemValue, itemIndex) => this.setSelectedDelay(itemIndex)}>
                            {delay_values.map(val => {
                                return <Picker.Item key={val} label={val} value={val} />
                            })}
                        </Picker>
                    </View>

                    <View style={styles.rowInputStyle}>
                        <Text style={styles.infoCreatePost}>Stato:</Text>
                        <Picker
                        selectedValue={status_values[this.state.status]}
                        style={styles.inputPicker}
                        itemStyle={styles.pickerItemStyle}
                        onValueChange={(itemValue, itemIndex) => this.setSelectedStatus(itemIndex)}>
                             {status_values.map(val => {
                                return <Picker.Item key={val} label={val} value={val} />
                            })}
                        </Picker>
                    </View>
                </View>
                <TouchableOpacity
                activeOpacity={0.7}
                style={styles.btnShare}
                onPress={() => this.createPost()}>
                    <Text style={styles.btnShareText}>Pubblica</Text>
                </TouchableOpacity>
            </View>
        }
        return <View><Text>Loading...</Text></View>
    }

    createPost = () => {
        if(this.state.delay != 0 || this.state.status != 0 || this.state.comment != ""){
            // faccio -1 perchè per usare il Picker ho aggiunto l'elem. vuoto alla pos. 0, e quindi ora devo scalare di uno indietro
            CommunicationController.addPost(this.state.sid, this.state.did, this.state.delay-1, this.state.status-1, this.state.comment)
            .then(result => {
                alert("Post pubblicato con successo")
                this.props.navigation.goBack()
            })
            .catch(error => {
                console.log(error);
                alert("Errore nella pubblicazione del Post, riprovare")
            })
        }
        else{
            alert("Fornire almeno un parametro!")
        }
    }

    onChangeComment = (value) => {
        if(value.length > 100)
            alert("Commento più piccolo di 100 caratteri, pls")
        else {
            // console.log("Commento cambiato " + value)
            this.state.comment = value;
        }
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f2f4f7"
    },
    infoCreatePost:{
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 6
    },
    input: {
        width: "95%",
        height: 40,
        marginLeft: 4,
        marginRight:4,
        borderWidth:0.5,
        padding: 10
    },
    inputPicker:{
        marginLeft: 6,
        width: "60%",
        // backgroundColor: 'yellow'
    },
    pickerItemStyle:{
        height: 110,
        fontSize:17,
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }]
    },
    txtLinea : {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "normal",
        color: "orange"
    },
    txtDirezione : {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        color: "orange"
    },
    infoStyle: {
        // flex:1,
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 2,
            backgroundColor: 'white',
            borderRadius: 15,
            padding: 24,
            margin: 16,
    },
    infoDirectionStyle: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    directionStyle:{
        flex:1,
        fontSize: 20,
        fontWeight: 'bold',
        alignItems: 'center',
        alignSelf: 'center',
        color: '#333E63',
        marginLeft: 6,
        marginRight: 6
    },
    imgStyle:{
        width: 55,
        height: 55
    },
    rowInputStyle:{
        flexDirection:'row',
        alignItems: 'center',
        width: "100%",
        margin: 6,
        justifyContent: 'space-between'
    },
    btnShare:{
        flex: 0.3,
        marginLeft: 10,
        marginRight:10,
        marginTop:20,
        width: "80%",
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#F8A059',
        borderRadius: 20,
        alignSelf: 'center'
    },
    btnShareText:{
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500'
    },
  });
 
export default CreatePostPage;