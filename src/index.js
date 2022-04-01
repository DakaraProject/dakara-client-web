import 'style/main.scss'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import persistState from 'redux-localstorage'
import ReduxThunk from 'redux-thunk'

import { ProtectedRoute } from 'components/generics/Router'
import LibraryList from 'components/library/List'
import Main from 'components/Main'
import NotFound from 'components/navigation/NotFound'
import Playlist from 'components/playlist/List'
import PlaylistPlayed from 'components/playlist/PlayedList'
import Login from 'components/registration/Login'
import Logout from 'components/registration/Logout'
import Register from 'components/registration/Register'
import ResetPassword from 'components/registration/ResetPassword'
import SendResetPasswordLink from 'components/registration/SendResetPasswordLink'
import VerifyEmail from 'components/registration/VerifyEmail'
import VerifyRegistration from 'components/registration/VerifyRegistration'
import SettingsKaraDateStop from 'components/settings/KaraDateStop'
import SettingsKaraStatus from 'components/settings/KaraStatus'
import SettingsSongTagsList from 'components/settings/songTags/List'
import SettingsTokens from 'components/settings/Tokens'
import SettingsUsersEdit from 'components/settings/users/Edit'
import SettingsUsersList from 'components/settings/users/List'
import User from 'components/user/User'
import manageStorageEvent from 'eventManagers/storage'
import delayMiddleware from 'middleware/delay'
import fetchApiMiddleware from 'middleware/fetchApi'
import reducer from 'reducers'

const store = createStore(
    reducer,
    compose(
        applyMiddleware(
            fetchApiMiddleware,
            ReduxThunk,
            delayMiddleware
        ),
        persistState('token')
    )
)

manageStorageEvent(store)

const root = createRoot(document.getElementById('react-mounting-point'))
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Main>
                <Switch>
                    <ProtectedRoute
                        exact
                        path="/library/:libraryType"
                        component={LibraryList}
                    />
                    <Redirect exact from="/library" to="/library/song"/>
                    <ProtectedRoute
                        exact
                        path="/playlist/queueing"
                        component={Playlist}
                    />
                    <ProtectedRoute
                        exact
                        path="/playlist/played"
                        component={PlaylistPlayed}
                    />
                    <Redirect exact from="/playlist" to="/playlist/queueing"/>
                    <ProtectedRoute exact path="/user" component={User}/>
                    <ProtectedRoute
                        exact
                        path="/settings/users/:userId"
                        component={SettingsUsersEdit}
                    />
                    <ProtectedRoute
                        exact
                        path="/settings/users"
                        component={SettingsUsersList}
                    />
                    <ProtectedRoute
                        exact
                        path="/settings/song-tags"
                        component={SettingsSongTagsList}
                    />
                    <ProtectedRoute
                        exact
                        path="/settings/kara-status"
                        component={SettingsKaraStatus}
                    />
                    <ProtectedRoute
                        exact
                        path="/settings/kara-date-stop"
                        component={SettingsKaraDateStop}
                    />
                    <ProtectedRoute
                        exact
                        path="/settings/tokens"
                        component={SettingsTokens}
                    />
                    <Redirect exact from="/settings" to="/settings/users"/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/logout" component={Logout}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/reset-password" component={ResetPassword}/>
                    <Route
                        exact
                        path="/send-reset-password-link"
                        component={SendResetPasswordLink}
                    />
                    <Route
                        exact
                        path="/verify-registration"
                        component={VerifyRegistration}
                    />
                    <Route exact path="/verify-email" component={VerifyEmail}/>
                    <Redirect exact from="/" to="/library"/>
                    <Route component={NotFound}/>
                </Switch>
            </Main>
        </BrowserRouter>
    </Provider>
)
