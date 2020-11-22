import firebase from 'firebase/app';

export default {
    actions: {
        async fetchGoals({commit, dispatch}) {
            try {
                const uid = await dispatch('getUserId')
                const goals = (await firebase.database().ref(`/user/${uid}/goal`).once('value')).val() || {}
                return Object.keys(goals).map(key => ({...goals[key], id: key}))
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async fetchGoalById({commit, dispatch}, id) {
            try {
                const uid = await dispatch('getUserId')
                const goal = (await firebase.database().ref(`/user/${uid}/goal`).child(id).once('value')).val() || {}
                return {...goal, id}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async updateGoal({commit, dispatch}, {title, limit, id}) {
            try {
                const uid = await dispatch('getUserId')
                await firebase.database().ref(`/user/${uid}/goal`).child(id).update({title, limit})
            } catch (e) {
                commit('setError', e)
                throw e
            }
        },
        async createGoal({commit, dispatch}, {title, limit}) {
            try {
                const uid = await dispatch('getUserId')
                const goal = await firebase.database().ref(`/user/${uid}/goal`).push({title, limit})
                return {title, limit, id: goal.key}
            } catch (e) {
                commit('setError', e)
                throw e
            }
        }
    }
}