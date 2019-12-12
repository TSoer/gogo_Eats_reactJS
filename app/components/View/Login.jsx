import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Panel, Button, Carousel, CarouselItem } from 'react-bootstrap';
import { Router, Route, Link, History } from 'react-router';

import api from '../API/api';
import BusinesService from '../API/BusinesService';

class Login extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            error: false
        }

        this.formInstance = null;
        this.handleSubmit = this.handleSubmit.bind(this);
        this._handleRecover = this._handleRecover.bind(this);
    }

    componentWillMount() {
        this._checkLogin();
    }

    componentWillUnmount() {
        this.ifMounted = false;
    }

    componentDidMount() {
        this.ifMounted = true;

        document.title = "Login - Gogo";
        $("#slider1").responsiveSlides({
            speed: 600
        });
        this.formInstance = $('form#loginForm')
            .parsley()
            .on('field:validated', () => {
                this.ifMounted && this.setState({
                    error: false
                })
            });
    }

    _checkLogin() {
        if (api.loggedIn()) {
            this.context.router.push('business/dashboard');
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        var isValid = this
            .formInstance
            .isValid();

        if (isValid) {
            const email = this.refs.email.value;
            const password = this.refs.password.value;

            BusinesService.login(email, password, (res) => {
                console.log("ok")
                var _router = this.context.router;
                _router.push('business/dashboard');
            }, (err) => {
                console.log(err.message)
                this.setState({ error: true })
            });
        }
    }

    _handleRecover(e) {
        if (e) {
            e.stopPropagation()
            e.preventDefault()
        }
        this.context.router.push('/recover');
    }

    render() {
        return (
            <div id="slide" style={{ width: '100%' }}>
                    <div className="login_box">
                        <div className="login_logo">
                            <a href="/" title="gogo"><img src="/img/logo_1.png" /></a>
                            <p className="text-center between_lines"><span>LOGIN TO CONTINUE</span></p>
                        </div>
                        <div className="login_form">
                            <form id="loginForm" method="post" data-parsley-validate="" noValidate className="mb-lg" onSubmit={this.handleSubmit}>
                                <p className="text-danger text-center" style={{ display: this.state.error ? 'block' : 'none' }}>
                                    {(() => {
                                        return (
                                            <span>
                                                Username or Password is incorrect.
                                            </span>
                                        )
                                    })()}
                                </p>
                                <div className="form-group has-feedback">
                                    <input id="input_email" type="email" ref="email" placeholder="Email Address" autoComplete="off" required="required" data-parsley-error-message="" className="form-control" />
                                    <span className="icon icon-user form-control-feedback text-muted icon-l"></span>
                                </div>
                                <div className="form-group has-feedback">
                                    <input id="input_password" type="password" ref="password" placeholder="Password" required="required" className="form-control" data-parsley-error-message="" />
                                    <span className="icon icon-lock form-control-feedback text-muted icon-l"></span>
                                </div>
                                <button type="submit" className="btn btn-block btn-login mt-lg">Login</button>
                            </form>
                        </div>
                    </div>{/* Login Box */}
                    <div className="bellow_login">
                        <a href="#" onClick={this._handleRecover} className="recover_account">¿Tienes problemas para iniciar sesión?</a>
                    </div>
            </div>
        );
    }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Login;
