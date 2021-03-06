const init_message = { message: 'REPLACE ME', visiblity: false }
// A quick fix to reset timeout duration, could also store this in store
// and pass it into reducer function below from calling component but
// I chose this way for simplicity and 'robustness' as caller may forget.
let cancelToken = null
const notification_reducer = (state = init_message, action) => {
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
            } })
        cancelToken = setTimeout(() => {
            dispatch({
                type: 'HIDE',
                data: {
                    message: '',
                    visiblity: false
                } })
        }, duration * 1000)
    }
}

export default notification_reducer