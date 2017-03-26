import React, { Component } from 'react'
import HeaderPage from '../containers/HeaderPage' 
import Footer from './Footer' 

class Main extends Component {
    render() {
        return (
            <div id="main">
                <HeaderPage/>
                <div id="content">
                    {this.props.children}
                </div>
                <Footer/>
            </div>
        )
    }
}

export default Main
