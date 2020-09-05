import firebase from 'firebase/app';

export default {
    actions: {
        async createCategory({commit, dispatch}, {title, limit}) {
            try {
                const uid = await dispatch('getUserId')
                const category = await firebase.database().ref(`/user/${uid}/category`).push({title, limit})
                return {title, limit, id: category.key}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}