const initialState = {
    user: null,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'CLEAR_USER':
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
};

export default UserReducer;
