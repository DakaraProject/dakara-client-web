export const permissionLevels = {
    u: 'user',
    m: 'manager',
    p: 'player'
}

export const mapStateToProps = (state) => ({
    user: state.authenticatedUser
})
