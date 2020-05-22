import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList,StyleSheet, Modal, Button } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment:  (dishId, rating, author,comment) => dispatch(postComment(dishId, rating, author,comment))
})

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={styles.icon_group}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            style={styles.icon}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onPressModal()}
                            style={styles.icon}
                        />
                    </View>
                    
                </Card>
                
            );
        }
        else {
            return(<View></View>);
        }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}


class DishDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            rating: 0,
            author: '',
            comment: ''
        }
    }
    
    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(dishId){ 
        this.props.postComment(dishId,+this.state.rating,this.state.author,this.state.comment);        
    }

    resetForm() {
        this.setState({
            rating: 0,            
            author: '',
            comment: '',
            showModal: false
        });
    }

    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        return (<ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressModal={() => this.toggleModal()}
                />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            <Modal animationType = {"slide"} transparent = {false}
                visible = {this.state.showModal}
                onDismiss = {() => this.toggleModal() }
                onRequestClose = {() => this.toggleModal() }>

                <View style={styles.modal}>

                    <Rating 
                        showRating fractions="{1}" startingValue="{3.3}" 
                        onFinishRating={rating => this.setState({rating: rating})}/>
                    
                    <Input
                        placeholder='  Author'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={value => this.setState({ author: value })}
                        />               
                
                    <Input
                        placeholder=' Comment'
                        leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                        onChangeText={value => this.setState({ comment: value })}
                        />                   
                    
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => {this.handleComment(dishId); this.resetForm();}}
                            title="Submit"
                            color="#512DA8" 
                                                
                            />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.toggleModal()}
                            title="Cancel"
                            color="grey"
                            style={styles.formRow}                        
                            />
                    </View>
                    
                </View>
            </Modal>
        </ScrollView>);
    }
    
}

const styles= StyleSheet.create({
    icon_group:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        flex:1        
    },
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    button:{
        margin: 40    
    }
    
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);