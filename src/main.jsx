import 'style/main.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { applyMiddleware, compose, createStore } from 'redux'
import persistState from 'redux-localstorage'
import { thunk } from 'redux-thunk'

import ProtectedRoute from 'components/generics/Router'
import Colors from 'components/lab/Colors'
import Fields from 'components/lab/Fields'
import Lab from 'components/lab/Lab'
import LibraryArtist from 'components/library/artist/List'
import Library from 'components/library/Library'
import LibrarySong from 'components/library/song/List'
import LibraryWork from 'components/library/work/List'
import Main from 'components/Main'
import NotFound from 'components/navigation/NotFound'
import PlaylistPlayed from 'components/playlist/played/List'
import PlayerErrors from 'components/playlist/playerErrors/List'
import Playlist from 'components/playlist/Playlist'
import PlaylistQueueing from 'components/playlist/queueing/List'
import Login from 'components/registration/Login'
import Logout from 'components/registration/Logout'
import Register from 'components/registration/Register'
import ResetPassword from 'components/registration/ResetPassword'
import SendResetPasswordLink from 'components/registration/SendResetPasswordLink'
import VerifyEmail from 'components/registration/VerifyEmail'
import VerifyRegistration from 'components/registration/VerifyRegistration'
import SettingsKaraDateStop from 'components/settings/KaraDateStop'
import SettingsKaraStatus from 'components/settings/KaraStatus'
import Settings from 'components/settings/Settings'
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
    applyMiddleware(fetchApiMiddleware, thunk, delayMiddleware),
    persistState('token')
  )
)

manageStorageEvent(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Main>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />
            <Route path="register" element={<Register />} />
            <Route
              path="verify-registration"
              element={<VerifyRegistration />}
            />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route
              path="send-reset-password-link"
              element={<SendResetPasswordLink />}
            />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route index element={<Navigate to="library" replace />} />
              <Route path="user" element={<User />} />
              <Route path="library" element={<Library />}>
                <Route index element={<Navigate to="song" replace />} />
                <Route path="song" element={<LibrarySong />} />
                <Route path="artist" element={<LibraryArtist />} />
                <Route path=":workType" element={<LibraryWork />} />
              </Route>
              <Route path="playlist" element={<Playlist />}>
                <Route index element={<Navigate to="queueing" replace />} />
                <Route path="queueing" element={<PlaylistQueueing />} />
                <Route path="played" element={<PlaylistPlayed />} />
                <Route path="player-errors" element={<PlayerErrors />} />
              </Route>
              <Route path="settings" element={<Settings />}>
                <Route index element={<Navigate to="users" replace />} />
                <Route path="users" element={<SettingsUsersList />} />
                <Route path="users/:userId" element={<SettingsUsersEdit />} />
                <Route path="song-tags" element={<SettingsSongTagsList />} />
                <Route path="kara-status" element={<SettingsKaraStatus />} />
                <Route
                  path="kara-date-stop"
                  element={<SettingsKaraDateStop />}
                />
                <Route path="tokens" element={<SettingsTokens />} />
              </Route>
            </Route>
            {/* #if DEV */}
            <Route path="lab" element={<Lab />}>
              <Route index element={<Navigate to="colors" replace />} />
              <Route path="colors" element={<Colors />} />
              <Route path="fields" element={<Fields />} />
            </Route>
            {/* #endif */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Main>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
