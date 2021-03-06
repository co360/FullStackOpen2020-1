const no_message = { message: '', visiblity: false }
let cancelToken = null

const notification_reducer = (state = no_message, action) => {
    switch (action.type) {
        case 'SHOW':
            return action.data
        case 'HIDE':
            return action.data
        default: return state
    }
}

export const show_notification_async = (notification, duration) => {
    return async dispatch => {
        if (cancelToken !== null) {
            clearTimeout(cancelToken)
        }
        dispatch({
            type: 'SHOW',
            data: {
                message: notification,
                visiblity: true
            }
        })
        cancelToken = setTimeout(() => {
            dispatch({
                type: 'HIDE',
                data: no_message
            })
        }, duration * 1000)
    }
}

export default notification_reducer