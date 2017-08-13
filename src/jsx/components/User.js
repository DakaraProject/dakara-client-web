import React from 'react'

export const permissionLevels = {
    u: "user",
    m: "manager",
    p: "player"
}

const User = ({ user, message, updatePassword }) => {
    let oldPassword, newPassword

    if(message){
        message = (
                <div className="notified">
                    <div className={"notification message " + message.type}>
                        {message.message}
                    </div>
                </div>
                )
    }

    return (
        <div className="box">
            <div>
                Username: { user.username }
                superUser:{ user.is_superuser ? 'true': 'false' }
                user app level :{ permissionLevels[user.users_permission_level] }
                library app level :{permissionLevels[user.library_permission_level] }
                playlist app level :{ permissionLevels[user.playlist_permission_level] }
            </div>
            {message}
            <form
                onSubmit={e => {
                    e.preventDefault()
                    updatePassword(user.id, oldPassword.value, newPassword.value)
                }}
                className="form block"
            >
                <div className="set">
                    <div className="field">
                        <label htmlFor="oldpassword">
                            Current password
                        </label>
                        <div className="input">
                            <input
                                id="oldpassword"
                                ref={node => {
                                    oldPassword = node
                                }}
                                type="password"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="password">
                            New password
                        </label>
                        <div className="input">
                            <input
                                id="password"
                                type="password"
                                ref={node => {
                                    newPassword = node
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="controls">
                    <button type="submit" className="control primary">
                        Change password
                    </button>
                </div>
            </form>
        </div>
    )
}

export default User
