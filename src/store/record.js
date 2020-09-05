import firebase from 'firebase/app'

export default {
    actions: {
        async createRecord({dispatch, commit}, record) {
            try {
                const uid = await dispatch('getUserId');
                return await firebase.database().ref(`/user/${uid}/records`).push(record)
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}
