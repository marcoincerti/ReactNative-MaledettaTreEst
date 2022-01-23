import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, View, ActivityIndicator, Alert } from 'react-native';

import CommunicationController from '../CommunicationController';
import Post from '../Post';
import PostWriter from '../PostWriter';

class BachecaDue extends React.Component {

    state = {
        postWriterVisible: false,
        jsonPost: null,
        line: "",
        direction: "",
        did: "",
        sid: "",
    }

    showAlert = () => {
        Alert.alert(
            'Non hai una connesione internet!'
        )
    }

    retrievePosts = (did) => {
        console.log(did, this.state.sid);
        CommunicationController.getPosts(this.state.sid, did)
            .then(response => {
                //console.log("response " + response)
                this.state.jsonPost = response.posts
                this.setState(this.state)
            })
            .catch(error => {
                console.log(error);
                this.showAlert();
            });
    }

    showPostWriter = () => {
        this.state.postWriterVisible = !this.state.postWriterVisible
        this.setState(this.state)
        console.log("showPostWriter: " + this.state.postWriterVisible)
    }

    changeDirection = () => {
        if (this.state.did == this.state.line.terminus1.did) {
            this.state.did = this.state.line.terminus2.did
            this.state.direction = this.state.line.terminus2
        } else {
            this.state.did = this.state.line.terminus1.did
            this.state.direction = this.state.line.terminus1
        }
        this.setState(this.state)
        this.retrievePosts(this.state.did);
    }


    componentDidMount() {
        this.state.line = this.props.route.params.line;
        this.state.direction = this.props.route.params.direction;
        this.state.sid = this.props.route.params.sid;
        this.state.did = this.props.route.params.direction.did;

        console.log("retrieve posts");
        this.retrievePosts(this.state.did);
    }

    renderSeparator = () => (
        <View
            style={{
                backgroundColor: 'black',
                height: 0.5,
            }}
        />
    );

    header = () => (
        <View>
            <Text style={this.styles.title}>{this.state.line.terminus1.sname + "\n" + this.state.line.terminus2.sname}</Text>
            <Text style={this.styles.subTitle}>Direzione {this.state.direction.sname}</Text>
            <Button title="Nuovo post" onPress={() => this.showPostWriter()}></Button>
        </View>
    )


    render() {

        if (!this.state.postWriterVisible && this.state.jsonPost != null) {
            return (
                <SafeAreaView>
                    <View style={this.styles.scrollView}>
                        <FlatList
                            data={this.state.jsonPost}
                            renderItem={(item) => { return (<Post data={item} sid={this.state.sid} />) }}
                            keyExtractor={item => item.datetime}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={() => (
                                <View>
                                    <Text style={this.styles.title}>{this.state.line.terminus1.sname + "\n" + this.state.line.terminus2.sname}</Text>
                                    <Text style={this.styles.subTitle}>Direzione {this.state.direction.sname}</Text>
                                    <Button title="Cambia direzione" onPress={() => this.changeDirection()}></Button>
                                    <Button title="Nuovo post" onPress={() => this.showPostWriter()}></Button>
                                </View>
                            )}
                        />
                    </View>
                    <StatusBar styles="auto" />
                </SafeAreaView>
            )
        }
        else if (this.state.postWriterVisible) {
            return <SafeAreaView>
                <ScrollView style={this.styles.scrollView}>
                    <Text style={this.styles.title}>{this.state.line.terminus1.sname + "\n" + this.state.line.terminus2.sname}</Text>
                    <Text style={this.styles.subTitle}>Direzione {this.state.direction.sname}</Text>
                    <Button title="Torna indietro" onPress={() => this.showPostWriter()}></Button>
                    <PostWriter did={this.state.direction.did} />
                </ScrollView>
            </SafeAreaView>
        } else {
            return <View style={[this.styles.container, this.styles.horizontal]}>
                <ActivityIndicator size="large" />
            </View>
        }
    }

    styles = StyleSheet.create({
        title: {
            fontSize: 34,
            paddingTop: 20,
        },
        subTitle: {
            fontSize: 20,
            paddingTop: 10,
            marginBottom: 20
        },
        scrollView: {
            marginHorizontal: 20,
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
        }

    });
}

export default BachecaDue;